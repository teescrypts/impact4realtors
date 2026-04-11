import { NextRequest, NextResponse } from "next/server";
import HomeValuationRequest from "@/app/model/home-valuation-request";
import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Lead from "@/app/model/lead";
import { handleTagChange } from "@/app/lib/execution-engine/entry-handler";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { status } = await req.json();

    // Ensure valid input
    if (!status || !["Pending", "Done"].includes(status)) {
      return apiResponse("Invalid status value", null, 400);
    }

    const _id = (await params).id;

    console.log(_id);

    const updated = await HomeValuationRequest.findOneAndUpdate(
      { _id, admin: admin._id },
      { status },
      { new: true },
    );

    console.log(updated);

    if (!updated) {
      return apiResponse("Request not found or unauthorized", null, 404);
    }

    if (status === "Done") {
      const oldLead = await Lead.findById(updated.lead);
      const updatedLead = await Lead.findByIdAndUpdate(
        updated.lead,
        { status: "valuation report sent" },
        { new: true },
      );

      await handleTagChange(
        oldLead._id.toString(),
        oldLead.status,
        updatedLead.status,
      );
    }

    return apiResponse("Status updated successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}
