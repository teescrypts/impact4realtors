import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import Property from "@/app/model/property";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const _id = (await params).id;
    await connectToDB();
    const property = await Property.findById(_id);
    if (!property) return apiResponse("Invalid Operation", null, 400);

    return apiResponse("success", { property }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
