import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Lead, { ILead } from "@/app/model/lead";
import { NextRequest, NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
import { handleTagAssignment } from "@/app/lib/execution-engine/entry-handler";
import { sweepOverdueJourneys } from "@/app/lib/execution-engine/sweeper";
import { attachJourneyProgress } from "@/app/lib/journey/attach-progress";
import { capitalizeFirst } from "@/app/utils/capitalize-first-letter";

const ITEMS_PER_PAGE = 500;

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAgent = admin.agent?.isAgent === true;

  // Opportunistic safety net for journeys whose delay timer never arrived.
  // Throttled internally and never throws - see sweeper.ts.
  void sweepOverdueJourneys();

  try {
    const searchParams = req.nextUrl.searchParams;
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const type = searchParams.get("type");

    if (!type)
      return apiResponse("Type of lead to fetch is required", null, 401);

    // Define query type using Mongoose FilterQuery
    const query: FilterQuery<ILead> = {
      [isAgent ? "agent" : "admin"]: admin._id,
      category: type,
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    const leads: ILead[] = await Lead.find(query)
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE);

    const leadsCount = await Lead.countDocuments({
      [isAgent ? "agent" : "admin"]: admin._id,
      type,
    });

    const hasMore =
      leads.length === ITEMS_PER_PAGE && leads.length < leadsCount;

    // Populates currentJourney / journeyProgress / nextScheduledAction, which
    // the list columns read but nothing previously filled in.
    const leadsWithJourney = await attachJourneyProgress(leads);

    return apiResponse(
      "Success",
      {
        leads: leadsWithJourney,
        hasMore,
        lastCreatedAt: leads.at(-1)?.createdAt || null,
      },
      200,
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  // Authenticate user
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const isAgent = admin.agent?.isAgent === true;

    // Destructure fields from body
    const {
      category,
      status,
      firstName,
      lastName,
      intent,
      email,
      phone,
      source,
      note,
      propertyId,
      buyerProfile,
    } = body;

    // Basic validation
    if (
      !status ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !intent ||
      !category
    ) {
      return apiResponse("Missing required fields", null, 400);
    }

    // Create the lead
    const newLead = await Lead.create({
      admin: isAgent ? admin.agent.admin : admin._id,
      ...((isAgent || admin.isBroker) && { agent: admin._id }),
      category: capitalizeFirst(category),
      intent,
      status,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      source: source?.trim() || "",
      note: note?.trim() || "",
      ...(propertyId && { propertyId }),
      ...(buyerProfile && { buyerProfile }),
    });

    await handleTagAssignment(newLead._id.toString(), status);

    return apiResponse("Lead added successfully", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}
