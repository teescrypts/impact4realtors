/**
 * Journey Execution Engine - Entry Point Handler
 *
 * This handles when a lead gets tagged and should enter a journey
 *
 * STRICT MODE (MVP):
 * - Only ONE active journey per unique entry point
 * - Only ONE active journey per lead at a time
 *
 * Future enhancements:
 * - Priority-based conflict resolution
 * - Journey queuing
 * - Parallel journeys with flag
 */

import { LeadJourneyProgress, Journey } from "../model/journey";
import Lead from "../model/lead";

/**
 * Handle tag assignment/change for a lead
 * This is called when a lead's tags are updated
 *
 * @param leadId - Lead ID
 * @param tagName - Tag that was assigned/changed
 * @param tagChangeType - "assign" or "change"
 * @param previousTag - Previous tag (for "change" type)
 */
export async function handleLeadTagChange(
  leadId: string,
  tagName: string,
  tagChangeType: "assign" | "change",
  previousTag?: string,
) {
  try {
    // Fetch the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`Lead ${leadId} not found`);
      return;
    }

    // 🔒 CRITICAL: Check if lead is already in an active journey (MVP Strict Mode)
    // This prevents a lead from being in multiple journeys simultaneously
    const existingProgress = await LeadJourneyProgress.findOne({
      lead: leadId,
      status: "active",
    }).populate("journey", "name");

    if (existingProgress) {
      console.log(
        `Lead ${leadId} already in active journey, skipping new entry`,
      );
      // MVP: Simply skip entry into new journey
      // Future: Could implement priority-based conflict resolution or queuing
      return;
    }

    // Find matching journeys for this entry point
    const query: any = {
      admin: lead.admin,
      contactType: lead.category,
      leadIntent: lead.intent,
      isActive: true,
      "entryAction.tagAction.type": tagChangeType,
      "entryAction.tagAction.tagName": tagName,
    };

    // For "change" type, also match the newTagName
    if (tagChangeType === "change" && previousTag) {
      // Note: In "change" type, tagName is the OLD tag, newTagName is the NEW tag
      // We're looking for journeys where:
      // - The old tag matches what the lead had before (previousTag)
      // - The new tag matches what was just assigned (tagName)
      query["entryAction.tagAction.newTagName"] = tagName;
      query["entryAction.tagAction.tagName"] = previousTag;
    }

    const matchingJourneys = await Journey.find(query).limit(1); // MVP: Only one can exist due to uniqueness

    if (matchingJourneys.length === 0) {
      console.log(
        `No active journey found for ${tagChangeType} tag "${tagName}" on ${lead.category} with intent ${lead.intent}`,
      );
      return;
    }

    // Double-check: Should only be one due to our uniqueness validation
    if (matchingJourneys.length > 1) {
      console.error(
        `CRITICAL: Found multiple active journeys with same entry point! This should not happen.`,
      );
      // Use first one as fallback
    }

    const journey = matchingJourneys[0];

    // Start the lead in this journey
    await startLeadJourney(lead, journey);
  } catch (error) {
    console.error("Error handling lead tag change:", error);
    throw error;
  }
}

/**
 * Start a lead in a journey
 * Creates a new LeadJourneyProgress and begins execution
 */
async function startLeadJourney(lead: any, journey: any) {
  console.log(
    `Starting lead ${lead._id} in journey "${journey.name}" (${journey._id})`,
  );

  // Create progress record
  const progress = await LeadJourneyProgress.create({
    lead: lead._id,
    journey: journey._id,
    admin: journey.admin,
    currentNodeId: journey.entryNodeId,
    status: "active",
    executionHistory: [],
    startedAt: new Date(),
    lastActivityAt: new Date(),
  });

  // Begin journey execution
  // Note: This would call the execution engine to start processing nodes
  // await executeNextNode(progress); // To be implemented in execution engine

  console.log(`Lead ${lead._id} successfully entered journey ${journey.name}`);
  return progress;
}

/**
 * Helper: Check if a lead can enter a new journey
 *
 * @param leadId - Lead ID
 * @returns true if lead can enter a new journey, false otherwise
 */
export async function canLeadEnterJourney(leadId: string): Promise<boolean> {
  const activeProgress = await LeadJourneyProgress.findOne({
    lead: leadId,
    status: "active",
  });

  return !activeProgress; // Can enter if no active progress
}

/**
 * Helper: Get the journey a lead is currently in
 *
 * @param leadId - Lead ID
 * @returns Journey progress or null
 */
export async function getLeadActiveJourney(leadId: string) {
  return LeadJourneyProgress.findOne({
    lead: leadId,
    status: "active",
  }).populate("journey");
}

// Future enhancement placeholders (commented for MVP)
/*
async function resolveJourneyConflict(
  lead: any,
  newJourney: any,
  existingProgress: any
): Promise<'skip' | 'pause-current' | 'queue'> {
  // Priority-based resolution
  const newPriority = newJourney.journeyPriority || 0;
  const currentPriority = existingProgress.journey.journeyPriority || 0;
  
  if (newPriority > currentPriority) {
    return 'pause-current'; // Pause current, start new
  }
  
  if (newJourney.allowParallelJourneys) {
    // Allow both to run
    return 'queue'; // Or implement actual parallel execution
  }
  
  return 'skip'; // Default: skip new journey
}

async function queueJourneyEntry(leadId: string, journeyId: string) {
  // Queue the journey to start after current one completes
  await JourneyQueue.create({
    lead: leadId,
    journey: journeyId,
    queuedAt: new Date()
  });
}
*/
