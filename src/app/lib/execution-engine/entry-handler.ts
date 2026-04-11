/**
 * Journey Entry Point Handler
 *
 * Handles when leads get tagged and should enter journeys
 * Implements strict mode: one journey per lead at a time
 */

import { LeadJourneyProgress, Journey } from "@/app/model/journey";
import Lead, { ILead } from "@/app/model/lead";
import { executeNextNode } from "./index";

/**
 * Handle tag assignment for a lead
 * This is called when a lead gets a new tag assigned
 *
 * @param leadId - Lead ID
 * @param tagName - Tag that was assigned
 */
export async function handleTagAssignment(
  leadId: string,
  tagName: string,
): Promise<void> {
  try {
    console.log(`Tag "${tagName}" assigned to lead ${leadId}`);

    // Fetch the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`Lead ${leadId} not found`);
      return;
    }

    // 🔒 STRICT MODE: Check if lead already in active journey
    const existingProgress = await LeadJourneyProgress.findOne({
      lead: leadId,
      status: "active",
    }).populate("journey", "name");

    if (existingProgress) {
      // console.log(
      //   `Lead ${leadId} already in active journey "${existingProgress.journey.name}", skipping new entry`,
      // );
      return; // MVP: Skip entry into new journey
    }

    // Find matching active journeys for tag assignment
    const matchingJourneys = await Journey.find({
      admin: lead.admin,
      ...(lead?.agent && { agent: lead.agent }),
      contactType: lead.category,
      leadIntent: lead.intent,
      isActive: true,
      "entryAction.tagAction.type": "assign",
      "entryAction.tagAction.tagName": tagName,
    }).limit(1); // Should only be one due to uniqueness validation

    if (matchingJourneys.length === 0) {
      console.log(
        `No active journey found for tag assignment "${tagName}" on ${lead.category} with intent ${lead.intent}`,
      );
      return;
    }

    if (matchingJourneys.length > 1) {
      console.error(
        `CRITICAL: Found ${matchingJourneys.length} active journeys with same entry point! This should not happen.`,
      );
    }

    const journey = matchingJourneys[0];

    // Start the lead in this journey
    await startLeadJourney(lead, journey);

    // Also check if this tag fulfills any waiting triggers
    const { resumeFromTrigger } = await import("./trigger");
    await resumeFromTrigger(leadId, tagName);
  } catch (error) {
    console.error("Error handling tag assignment:", error);
  }
}

/**
 * Handle tag change for a lead
 * This is called when a lead's tag is changed from one value to another
 *
 * @param leadId - Lead ID
 * @param oldTag - Previous tag value
 * @param newTag - New tag value
 */
export async function handleTagChange(
  leadId: string,
  oldTag: string,
  newTag: string,
): Promise<void> {
  try {
    console.log(
      `Tag changed from "${oldTag}" to "${newTag}" for lead ${leadId}`,
    );

    // Fetch the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`Lead ${leadId} not found`);
      return;
    }

    console.log(lead)

    // 🔒 STRICT MODE: Check if lead already in active journey
    const existingProgress = await LeadJourneyProgress.findOne({
      lead: leadId,
      status: "active",
    }).populate("journey", "name");

    if (existingProgress) {
      // console.log(
      //   `Lead ${leadId} already in active journey "${existingProgress.journey.name}", skipping new entry`,
      // );

      // Still check if this tag fulfills a waiting trigger in current journey
      const { resumeFromTrigger } = await import("./trigger");
      await resumeFromTrigger(leadId, newTag);
      return;
    }

    // Find matching active journeys for tag change
    const matchingJourneys = await Journey.find({
      admin: lead.admin,
      ...(lead?.agent && { agent: lead.agent }),
      contactType: lead.category,
      leadIntent: lead.intent,
      isActive: true,
      "entryAction.tagAction.type": "change",
      "entryAction.tagAction.tagName": oldTag,
      "entryAction.tagAction.newTagName": newTag,
    }).limit(1); // Should only be one due to uniqueness validation

    console.log({
      admin: lead.admin,
      ...(lead?.agent && { agent: lead.agent }),
      contactType: lead.category,
      leadIntent: lead.intent,
      isActive: true,
      "entryAction.tagAction.type": "change",
      "entryAction.tagAction.tagName": oldTag,
      "entryAction.tagAction.newTagName": newTag,
    })

    if (matchingJourneys.length === 0) {
      console.log(
        `No active journey found for tag change "${oldTag}" → "${newTag}" on ${lead.category} with intent ${lead.intent}`,
      );
      return;
    }

    if (matchingJourneys.length > 1) {
      console.error(
        `CRITICAL: Found ${matchingJourneys.length} active journeys with same entry point! This should not happen.`,
      );
    }

    const journey = matchingJourneys[0];

    // Start the lead in this journey
    await startLeadJourney(lead, journey);
  } catch (error) {
    console.error("Error handling tag change:", error);
  }
}

/**
 * Start a lead in a journey
 * Creates progress record and begins execution
 *
 * @param lead - Lead document
 * @param journey - Journey document
 */
async function startLeadJourney(lead: ILead, journey: any): Promise<void> {
  console.log(
    `🚀 Starting lead ${lead.email} in journey "${journey.name}" (${journey._id})`,
  );

  try {
    // Create progress record
    const progress = await LeadJourneyProgress.create({
      lead: lead._id,
      journey: journey._id,
      admin: journey.admin,
      ...(lead?.agent && { agent: lead.agent }),
      currentNodeId: journey.entryNodeId,
      status: "active",
      executionHistory: [],
      startedAt: new Date(),
      lastActivityAt: new Date(),
    });

    console.log(`✅ Lead ${lead.email} entered journey "${journey.name}"`);

    const progressId = progress._id as string;
    // Begin journey execution
    await executeNextNode(progressId);
  } catch (error) {
    console.error(
      `Error starting lead ${lead._id} in journey ${journey._id}:`,
      error,
    );
    throw error;
  }
}

/**
 * Check if a lead can enter a new journey
 * Helper function for UI/validation
 *
 * @param leadId - Lead ID
 * @returns true if lead can enter, false if already in journey
 */
export async function canLeadEnterJourney(leadId: string): Promise<boolean> {
  const activeProgress = await LeadJourneyProgress.findOne({
    lead: leadId,
    status: "active",
  });

  return !activeProgress;
}

/**
 * Get the journey a lead is currently in
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
