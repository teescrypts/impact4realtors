/**
 * Resume Journey Webhook Handler
 * 
 * Handles resuming journeys after time delays
 * Triggered by scheduled Resend emails
 */

import { resumeFromDelay } from "@/app/lib/execution-engine/delay";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/webhooks/resume-journey
 * Resume a journey after a delay
 * 
 * Called by Resend scheduled emails sent by the delay executor
 * 
 * Payload (in email body):
 * {
 *   progressId: string;
 *   nextNodeId: string;
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // The payload is in the email body/html
    // Resend forwards the email content to our webhook
    const body = await req.json();

    console.log("Received resume journey webhook");

    // Extract payload from email
    // The delay executor sends this as JSON in the email body
    let payload: { progressId: string; nextNodeId: string };

    // Try to parse from different possible formats
    if (body.progressId && body.nextNodeId) {
      payload = body;
    } else if (body.html || body.text) {
      // Parse from email content
      const content = body.html || body.text;
      const match = content.match(/\{[\s\S]*?"progressId"[\s\S]*?\}/);
      if (match) {
        payload = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse payload from email content");
      }
    } else {
      throw new Error("Invalid payload format");
    }

    const { progressId, nextNodeId } = payload;

    if (!progressId || !nextNodeId) {
      return NextResponse.json(
        { error: "Missing progressId or nextNodeId" },
        { status: 400 }
      );
    }

    console.log(`Resuming journey progress ${progressId} at node ${nextNodeId}`);

    // Resume the journey
    await resumeFromDelay(progressId, nextNodeId);

    return NextResponse.json({
      success: true,
      message: "Journey resumed successfully",
    });
  } catch (error: any) {
    console.error("Error resuming journey:", error);
    return NextResponse.json(
      { error: "Failed to resume journey", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/resume-journey
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Resume journey webhook endpoint is active",
  });
}
