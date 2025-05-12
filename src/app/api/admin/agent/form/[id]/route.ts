import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import AgentForm from "@/app/model/agent-form";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const _id = (await params).id;

    const form = await AgentForm.findById(_id).select("email");

    if (!form) return apiResponse("Invalid form link", null, 404);

    return apiResponse("Success", { form }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
