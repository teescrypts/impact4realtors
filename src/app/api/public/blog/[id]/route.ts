import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import BlogPost from "@/app/model/blog";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const _id = (await params).id;
    const blog = await BlogPost.findById(_id);

    if (!blog) return apiResponse("Invalid Operation", null, 401);
    return apiResponse("Success", { blog }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
