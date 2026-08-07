/**
 * Attach journey summaries to a page of leads.
 *
 * The leads list shows which automation each lead is on, how far through it is
 * and what happens next. Those fields existed on the Lead type but nothing
 * populated them, so the columns were permanently blank on real data.
 *
 * Batched rather than per-lead: three queries regardless of how many leads are
 * on the page.
 */

import { LeadJourneyProgress, ScheduledAction } from "@/app/model/journey";
import { summariseProgress } from "./path";

interface LeadLike {
  _id: unknown;
  toObject?: () => Record<string, unknown>;
}

/** Which progress matters most when a lead has been through several journeys. */
const STATUS_RANK: Record<string, number> = {
  active: 0,
  paused: 1,
  failed: 2,
  cancelled: 3,
  completed: 4,
};

export async function attachJourneyProgress<T extends LeadLike>(
  leads: T[],
): Promise<Record<string, unknown>[]> {
  const plain = leads.map((lead) =>
    typeof lead.toObject === "function"
      ? lead.toObject()
      : (lead as unknown as Record<string, unknown>),
  );

  if (plain.length === 0) return plain;

  const leadIds = leads.map((lead) => lead._id);

  const progresses = await LeadJourneyProgress.find({
    lead: { $in: leadIds },
  })
    .populate("journey", "name contactType leadIntent isBuiltIn nodes edges entryNodeId")
    .sort({ lastActivityAt: -1 })
    .lean();

  if (progresses.length === 0) return plain;

  // One progress per lead: a running automation wins over a finished one, and
  // the most recently active wins within the same status.
  const byLead = new Map<string, any>();

  for (const progress of progresses as any[]) {
    const key = String(progress.lead);
    const existing = byLead.get(key);

    if (
      !existing ||
      (STATUS_RANK[progress.status] ?? 9) < (STATUS_RANK[existing.status] ?? 9)
    ) {
      byLead.set(key, progress);
    }
  }

  const actions = await ScheduledAction.find({
    leadJourneyProgress: { $in: [...byLead.values()].map((p) => p._id) },
    status: "pending",
  })
    .sort({ scheduledFor: 1 })
    .lean();

  // Earliest pending action per progress - sorted above, so first wins.
  const nextAction = new Map<string, any>();
  for (const action of actions as any[]) {
    const key = String(action.leadJourneyProgress);
    if (!nextAction.has(key)) nextAction.set(key, action);
  }

  return plain.map((lead) => {
    const progress = byLead.get(String(lead._id));
    if (!progress) return lead;

    const journey = progress.journey;

    // A journey that was deleted leaves the progress orphaned - skip rather
    // than blow up on a missing nodes array.
    if (!journey) return lead;

    const summary = summariseProgress(journey, progress);

    const currentNode = (journey.nodes ?? []).find(
      (node: { id: string }) => node.id === progress.currentNodeId,
    );

    const action = nextAction.get(String(progress._id));

    return {
      ...lead,
      currentJourney: {
        _id: journey._id,
        name: journey.name,
        contactType: journey.contactType,
        leadIntent: journey.leadIntent,
        isBuiltIn: journey.isBuiltIn,
      },
      journeyProgress: {
        _id: progress._id,
        status: progress.status,
        currentNodeId: progress.currentNodeId,
        currentNodeType: currentNode?.type,
        progressPercentage: summary.percentage,
        totalNodes: summary.totalSteps,
        completedNodes: summary.completedSteps,
        startedAt: progress.startedAt,
        lastActivityAt: progress.lastActivityAt,
        completedAt: progress.completedAt,
        pausedAt: progress.pausedAt,
        failedAt: progress.failedAt,
      },
      ...(action && {
        nextScheduledAction: {
          _id: action._id,
          type: action.actionType,
          scheduledFor: action.scheduledFor,
          nodeId: action.nodeId,
          status: action.status,
          description: action.actionType.replace(/_/g, " "),
        },
      }),
    };
  });
}
