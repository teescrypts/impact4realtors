import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import BlogPost from "@/app/model/blog";
import Image from "@/app/model/images";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const blog = new BlogPost({ ...body, admin: admin._id });
    await blog.save();

    await Image.findOneAndUpdate(
      {
        admin: admin._id,
        status: "drafted",
        type: "blog",
      },
      { status: "uploaded" }
    );

    return apiResponse("blog uploaded", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const blogs = await BlogPost.find({ admin: admin._id });
    return apiResponse("success", { blogs }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
