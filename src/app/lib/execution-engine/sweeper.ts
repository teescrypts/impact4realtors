/**
 * Overdue Journey Sweeper
 *
 * Delays are implemented as scheduled emails that call back when they fire.
 * If one of those never arrives - it bounced, Resend dropped it, the webhook
 * 500'd - the journey waits forever and the lead silently stops being followed
 * up. Nothing else in the system would ever notice.
 *
 * This is the safety net. It finds journeys whose resume time has passed while
 * they are still parked, and pushes them along.
 *
 * There is no cron in this project, so rather than running on a schedule it is
 * called opportunistically from a request an admin already makes. That makes
 * it imprecise - a stuck journey recovers the next time someone opens the
 * dashboard, not the moment it is due - but it needs no infrastructure and
 * turns "stuck forever" into "late".
 */

import { LeadJourneyProgress } from "@/app/model/journey";

/** Don't sweep more than once per interval, however many requests arrive. */
const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

/** Cap the work any single request can absorb. */
const MAX_PER_SWEEP = 25;

// Module scope, so this is per server instance. Several instances sweeping the
// same journey is harmless: executeNextNode re-reads status before acting.
let lastSweptAt = 0;
let inFlight = false;

export interface SweepResult {
  skipped: boolean;
  swept: number;
}

/**
 * Resume journeys whose delay elapsed without the timer arriving.
 *
 * Safe to call from anywhere and safe to call often - it throttles itself and
 * never throws, since callers run it as a side errand rather than the point of
 * the request.
 */
export async function sweepOverdueJourneys(): Promise<SweepResult> {
  const now = Date.now();

  if (inFlight || now - lastSweptAt < SWEEP_INTERVAL_MS)
    return { skipped: true, swept: 0 };

  inFlight = true;
  lastSweptAt = now;

  try {
    const overdue = await LeadJourneyProgress.findReadyToResume();

    if (overdue.length === 0) return { skipped: false, swept: 0 };

    const batch = overdue.slice(0, MAX_PER_SWEEP);

    console.warn(
      `Sweeper: ${overdue.length} journey(s) overdue, resuming ${batch.length}`,
    );

    const { getNextNode } = await import(".");
    const { resumeFromDelay } = await import("./delay");

    let swept = 0;

    for (const progress of batch) {
      try {
        // Take the same route the timer would have: resumeFromDelay clears the
        // wait, advances the node and continues. It re-checks status and
        // waitingFor first, so if the real timer lands at the same moment only
        // one of them takes effect.
        const nextNode = getNextNode(
          progress.journey as any,
          progress.currentNodeId,
        );

        if (!nextNode) {
          console.warn(
            `Sweeper: ${progress._id} is overdue at ${progress.currentNodeId} with nowhere to go; completing`,
          );
          await progress.complete();
          continue;
        }

        await resumeFromDelay(String(progress._id), nextNode.id);
        swept += 1;
      } catch (error) {
        console.error(`Sweeper: failed to resume ${progress._id}:`, error);
      }
    }

    return { skipped: false, swept };
  } catch (error) {
    console.error("Sweeper: failed to run:", error);
    return { skipped: false, swept: 0 };
  } finally {
    inFlight = false;
  }
}
