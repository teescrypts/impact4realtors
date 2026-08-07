/**
 * Resend Webhook Handler - OPTIMIZED
 *
 * Handles email events from Resend (opened, clicked, delivered, etc.)
 * Updates journey execution history and resumes delayed journeys
 *
 * FEATURES:
 * - Signature verification using Resend SDK
 * - Handles both email events AND scheduled journey resumption
 * - Early returns for better performance
 * - Type-safe event handling
 * - Proper error handling with specific status codes
 */

import { resumeFromConditionTimeout } from "@/app/lib/execution-engine/condition";
import { resumeFromDelay } from "@/app/lib/execution-engine/delay";
import { handleResendWebhook } from "@/app/lib/execution-engine/send-email";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend client once (module-level singleton)
const resend = new Resend(process.env.RESEND_API_KEY);

// Type definitions for better type safety
type EmailEventType =
  | "opened"
  | "clicked"
  | "delivered"
  | "bounced"
  | "complained"
  | "sent";

interface ResendWebhookData {
  email_id: string;
  tags?: {
    progressId?: string;
    nextNodeId?: string;
    /** Which executor should handle this timer: "delay" | "condition_timeout" */
    timerKind?: string;
    nodeId?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface VerifiedEvent {
  type: string;
  data: ResendWebhookData;
}

// Event type mapping (constant for reusability)
const EVENT_TYPE_MAP: Record<string, EmailEventType> = {
  "email.opened": "opened",
  "email.clicked": "clicked",
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.sent": "sent",
};

/**
 * Verify webhook signature
 */
async function verifyWebhook(
  req: NextRequest,
  payload: string,
): Promise<VerifiedEvent> {
  const headers = {
    id: req.headers.get("svix-id") as string,
    timestamp: req.headers.get("svix-timestamp") as string,
    signature: req.headers.get("svix-signature") as string,
  };

  // Validate required headers exist
  if (!headers.id || !headers.timestamp || !headers.signature) {
    throw new Error("MISSING_HEADERS");
  }

  // Validate webhook secret exists.
  // TODO: drop the misspelled fallback once every environment has been
  // renamed to RESEND_WEBHOOK_SECRET. It exists only so deploys that still
  // carry the old name keep verifying instead of silently 500ing.
  const webhookSecret =
    process.env.RESEND_WEBHOOK_SECRET ?? process.env.RESEND_WEBHOOK_SECERET;

  if (process.env.RESEND_WEBHOOK_SECRET === undefined && webhookSecret) {
    console.warn(
      'RESEND_WEBHOOK_SECERET is misspelled — rename it to RESEND_WEBHOOK_SECRET.',
    );
  }

  if (!webhookSecret) {
    throw new Error("MISSING_SECRET");
  }

  // Verify signature
  try {
    const result = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret,
    });

    return result as VerifiedEvent;
  } catch (error) {
    console.log(error)
    throw new Error("INVALID_SIGNATURE");
  }
}

/**
 * Handle a journey timer firing.
 *
 * Timers are Resend scheduled emails tagged by the scheduler. `timerKind`
 * decides which executor takes over; it is absent on timers scheduled before
 * condition timeouts existed, which were always delays.
 */
async function handleJourneyTimer(tags: {
  progressId?: string;
  nextNodeId?: string;
  timerKind?: string;
  nodeId?: string;
}): Promise<void> {
  const { progressId, nextNodeId, timerKind, nodeId } = tags;

  if (!progressId) return;

  try {
    if (timerKind === "condition_timeout") {
      if (!nodeId) {
        console.error("Condition timeout timer missing nodeId");
        return;
      }
      await resumeFromConditionTimeout(progressId, nodeId);
      console.log(`✅ Condition timed out: ${progressId} → ${nodeId}`);
      return;
    }

    if (!nextNodeId) {
      console.error("Delay timer missing nextNodeId");
      return;
    }

    await resumeFromDelay(progressId, nextNodeId);
    console.log(`✅ Journey resumed: ${progressId} → ${nextNodeId}`);
  } catch (error) {
    console.error("❌ Failed to handle journey timer:", error);
    throw error;
  }
}

/**
 * Handle email event tracking
 */
async function handleEmailEvent(
  emailId: string,
  eventType: EmailEventType,
): Promise<void> {
  try {
    await handleResendWebhook(emailId, eventType);
    console.log(`✅ Email event processed: ${emailId} - ${eventType}`);
  } catch (error) {
    console.error("❌ Failed to process email event:", error);
    throw error;
  }
}

/**
 * POST /api/webhooks/resend
 * Handle Resend webhook events
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get raw payload
    const payload = await req.text();

    // 2. Verify webhook signature
    let event: VerifiedEvent;
    try {
      event = await verifyWebhook(req, payload);
    } catch (error: any) {
      const errorResponses: Record<string, [string, number]> = {
        MISSING_HEADERS: ["Missing svix headers", 400],
        MISSING_SECRET: ["Webhook secret not configured", 500],
        INVALID_SIGNATURE: ["Invalid webhook signature", 401],
      };

      const [message, status] = errorResponses[error.message] || [
        "Webhook verification failed",
        400,
      ];

      console.error(`🚫 Webhook verification failed: ${error.message}`);
      return NextResponse.json({ error: message }, { status });
    }

    console.log(`📨 Verified webhook: ${event.type}`);

    // 3. Check if this is a journey timer firing (highest priority).
    //    Resend emits several events per email (sent/delivered/opened); only
    //    act on the first delivery signal so one timer fires once.
    const { tags, email_id } = event.data;
    if (tags?.progressId && (tags?.nextNodeId || tags?.nodeId)) {
      if (event.type !== "email.sent") {
        return NextResponse.json({ received: true, type: "timer_duplicate" });
      }

      await handleJourneyTimer(tags);
      return NextResponse.json({ received: true, type: "journey_resumed" });
    }

    // 4. Map event type to internal event
    const eventType = EVENT_TYPE_MAP[event.type];
    if (!eventType) {
      console.log(`⚠️ Unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true, type: "unhandled" });
    }

    // 5. Validate email_id exists
    if (!email_id) {
      console.log("⚠️ No email_id in webhook data");
      return NextResponse.json({ received: true, type: "no_email_id" });
    }

    // 6. Process email event
    await handleEmailEvent(email_id, eventType);

    return NextResponse.json({
      received: true,
      type: "email_event",
      eventType,
    });
  } catch (error: any) {
    console.error("💥 Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/webhooks/resend
 * Health check for webhook endpoint
 */
export async function GET() {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const hasSecret = !!process.env.RESEND_WEBHOOK_SECRET;
  const hasMisspelledSecret = !!process.env.RESEND_WEBHOOK_SECERET;

  return NextResponse.json({
    status: "ok",
    message: "Resend webhook endpoint is active",
    config: {
      apiKey: hasApiKey ? "configured" : "missing",
      webhookSecret: hasSecret
        ? "configured"
        : hasMisspelledSecret
          ? "configured (rename RESEND_WEBHOOK_SECERET → RESEND_WEBHOOK_SECRET)"
          : "missing",
    },
  });
}
