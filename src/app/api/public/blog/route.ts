import apiResponse from "@/app/lib/api-response";
import BlogPost from "@/app/model/blog";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "9", 10);
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      BlogPost.find({ admin }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BlogPost.countDocuments({ admin }),
    ]);

    return apiResponse(
      "Success",
      {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
        },
      },
      201
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
