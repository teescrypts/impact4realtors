import { NextResponse } from "next/server";
import Agent from "@/app/model/agent";
import { Types } from "mongoose";
import { connectToDB } from "@/app/lib/mongoosejs";
import apiResponse from "@/app/lib/api-response";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const _id = (await params).id;

    // Validate ID format
    if (!Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { message: "Invalid agent ID" },
        { status: 400 }
      );
    }

    const agent = await Agent.findOne({ owner: _id }).lean();

    if (!agent) {
      return NextResponse.json({ message: "Agent not found" }, { status: 404 });
    }

    return apiResponse("Success", { agent }, 200);
  } catch (e) {
    console.error("Error fetching agent:", e);
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
