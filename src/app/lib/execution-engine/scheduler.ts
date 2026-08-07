/**
 * Journey Timer
 *
 * Both the delay node and the email-open condition need to wake a journey up
 * at a future time. That timer is currently implemented by asking Resend to
 * deliver a scheduled email to the admin, which comes back to us as a webhook.
 *
 * Everything that needs a timer goes through here so there is a single place
 * to swap the transport (a real scheduler / queue) later.
 */

import { ScheduledAction } from "@/app/model/journey";
import Admin from "@/app/model/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export type TimerKind = "delay" | "condition_timeout";

export type DurationUnit = "minutes" | "hours" | "days";

/**
 * Resend will not schedule an email further than 30 days ahead, so no journey
 * timer can be longer than that. The builder only offers valid windows; this
 * is the backstop for anything saved before that limit was enforced.
 */
export const MAX_SCHEDULE_DAYS = 30;

/** Add a duration to `from` without mutating it. */
export function addDuration(
  from: Date,
  duration: number,
  unit: DurationUnit,
): Date {
  const result = new Date(from.getTime());

  switch (unit) {
    case "minutes":
      result.setMinutes(result.getMinutes() + duration);
      break;
    case "hours":
      result.setHours(result.getHours() + duration);
      break;
    case "days":
      result.setDate(result.getDate() + duration);
      break;
  }

  return result;
}

/**
 * Schedule a wake-up for a journey.
 *
 * @param progress - Lead journey progress (populated)
 * @param nodeId - Node the timer belongs to
 * @param resumeAt - When to wake up
 * @param kind - Which executor should handle the wake-up
 * @param nextNodeId - Node to resume at (delays only; conditions branch themselves)
 * @returns The Resend id of the scheduled email (used to correlate the
 *          webhook) and the time it was actually scheduled for, which may be
 *          earlier than requested if it had to be clamped.
 */
export async function scheduleJourneyResume({
  progress,
  nodeId,
  resumeAt,
  kind,
  nextNodeId,
}: {
  progress: any;
  nodeId: string;
  resumeAt: Date;
  kind: TimerKind;
  nextNodeId?: string;
}): Promise<{ scheduledEmailId: string; scheduledFor: Date }> {
  const maxResumeAt = addDuration(new Date(), MAX_SCHEDULE_DAYS, "days");

  // Clamping rather than throwing: a journey that resumes early is
  // recoverable, one that never resumes is not.
  const scheduledFor = resumeAt > maxResumeAt ? maxResumeAt : resumeAt;

  if (scheduledFor !== resumeAt) {
    console.warn(
      `Timer for ${progress._id} exceeds Resend's ${MAX_SCHEDULE_DAYS}-day limit; clamping`,
    );
  }

  const admin = await Admin.findById(progress.admin).select("email").lean<{
    email?: string;
  }>();

  if (!admin?.email) {
    // Throwing (rather than returning) hands this to handleExecutionError so
    // the journey retries or fails loudly instead of stalling forever.
    throw new Error(`No admin email found for progress ${progress._id}`);
  }

  const payload = {
    progressId: progress._id.toString(),
    kind,
    nodeId,
    ...(nextNodeId && { nextNodeId }),
  };

  const scheduled = await resend.emails.send({
    from: "system@realtyillustration.com",
    to: admin.email,
    subject: "Resume Journey",
    html: `<p>Resume journey</p><pre>${JSON.stringify(payload, null, 2)}</pre>`,
    scheduledAt: scheduledFor.toISOString(),
    tags: [
      { name: "progressId", value: payload.progressId },
      { name: "timerKind", value: kind },
      { name: "nodeId", value: nodeId },
      ...(nextNodeId ? [{ name: "nextNodeId", value: nextNodeId }] : []),
    ],
  });

  if (scheduled.error) {
    throw new Error(`Failed to schedule resume: ${scheduled.error.message}`);
  }

  const scheduledEmailId = scheduled.data?.id;

  if (!scheduledEmailId) {
    throw new Error("Resend returned no id for the scheduled resume email");
  }

  await ScheduledAction.create({
    leadJourneyProgress: progress._id,
    journey: progress.journey._id,
    lead: progress.lead._id,
    admin: progress.admin,
    ...(progress?.agent && { agent: progress.agent }),
    nodeId,
    actionType: "resume_journey",
    scheduledFor,
    resendScheduledEmailId: scheduledEmailId,
    status: "pending",
    payload: {
      type: "resume_journey",
      data: payload,
    },
  });

  console.log(
    `Scheduled ${kind} resume for ${progress._id} at ${scheduledFor.toISOString()} (${scheduledEmailId})`,
  );

  return { scheduledEmailId, scheduledFor };
}
