import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import {
  Journey,
  LeadJourneyProgress,
  ScheduledAction,
} from "@/app/model/journey";

/**
 * GET /api/journeys/stats
 * Get overall journey statistics for the admin
 */
export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse; // Retrieve user ID
    if (!admin)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let isAgent;

    if (admin.agent.isAgent) {
      isAgent = true;
    }

    const adminId = admin._id;

    // Journey counts
    const [totalJourneys, activeJourneys, draftJourneys] = await Promise.all([
      Journey.countDocuments({ [isAgent ? "agent" : "admin"]: adminId }),
      Journey.countDocuments({
        [isAgent ? "agent" : "admin"]: adminId,
        isActive: true,
      }),
      Journey.countDocuments({
        [isAgent ? "agent" : "admin"]: adminId,
        isDraft: true,
      }),
    ]);

    // Progress statistics
    const progressStats = await LeadJourneyProgress.aggregate([
      { $match: { [isAgent ? "agent" : "admin"]: adminId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const progressMap = progressStats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Scheduled action statistics
    const actionStats = await ScheduledAction.aggregate([
      { $match: { [isAgent ? "agent" : "admin"]: adminId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const actionMap = actionStats.reduce(
      (acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Top performing journeys (by completion rate)
    const topJourneys = await LeadJourneyProgress.aggregate([
      { $match: { [isAgent ? "agent" : "admin"]: adminId } },
      {
        $group: {
          _id: "$journey",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $multiply: [{ $divide: ["$completed", "$total"] }, 100] },
            ],
          },
        },
      },
      { $sort: { completionRate: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "journeys",
          localField: "_id",
          foreignField: "_id",
          as: "journey",
        },
      },
      { $unwind: "$journey" },
      {
        $project: {
          _id: 1,
          name: "$journey.name",
          total: 1,
          completed: 1,
          active: 1,
          completionRate: { $round: ["$completionRate", 2] },
        },
      },
    ]);

    // Recent activity
    const recentActivity = await LeadJourneyProgress.find({
      [isAgent ? "agent" : "admin"]: adminId,
    })
      .sort({ lastActivityAt: -1 })
      .limit(10)
      .populate("journey", "name")
      .populate("lead", "firstName lastName email")
      .select("journey lead status lastActivityAt currentNodeId")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        journeys: {
          total: totalJourneys,
          active: activeJourneys,
          draft: draftJourneys,
          inactive: totalJourneys - activeJourneys - draftJourneys,
        },
        progresses: {
          active: progressMap.active || 0,
          completed: progressMap.completed || 0,
          paused: progressMap.paused || 0,
          failed: progressMap.failed || 0,
          total: progressStats.reduce((sum, s) => sum + s.count, 0),
        },
        scheduledActions: {
          pending: actionMap.pending || 0,
          sent: actionMap.sent || 0,
          failed: actionMap.failed || 0,
          cancelled: actionMap.cancelled || 0,
          total: actionStats.reduce((sum, s) => sum + s.count, 0),
        },
        topJourneys,
        recentActivity,
      },
    });
  } catch (error: any) {
    console.error("Error fetching journey stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error.message },
      { status: 500 },
    );
  }
}
