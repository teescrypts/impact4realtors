import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import AgentForm from "@/app/model/agent-form";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// GET all pending forms
export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const forms = await AgentForm.find({ admin: admin._id }).sort({
      createdAt: -1,
    });
    return apiResponse("success", { forms }, 201);
  } catch (e) {
    console.error("[AGENT_FORM_GET]", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

// POST a new pending form
export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const newAgentForm = new AgentForm({ email, admin: admin._id });

    await newAgentForm.save();
    return apiResponse("Form created", null, 201);
  } catch (e) {
    console.error("[AGENT_FORM_POST]", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

// DELETE a pending form by ID
export async function DELETE(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid or missing form ID." },
      { status: 400 }
    );
  }

  try {
    await AgentForm.findByIdAndDelete(id);
    return apiResponse("Form deleted", null, 201);
  } catch (e) {
    console.error("[AGENT_FORM_DELETE]", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
