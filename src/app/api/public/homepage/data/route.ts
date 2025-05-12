import apiResponse from "@/app/lib/api-response";
import Agent from "@/app/model/agent";
import BlogPost from "@/app/model/blog";
import Property from "@/app/model/property";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);

    const [forRent, forSale, publishedBlogs, agents] = await Promise.all([
      Property.find({
        category: "For Rent",
        admin,
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .select(
          "propertyTitle bedrooms bathrooms squareMeters status price location images category createdAt"
        ),

      Property.find({ category: "For Sale", admin })
        .sort({ createdAt: -1 })
        .limit(3)
        .select(
          "propertyTitle bedrooms bathrooms squareMeters status price location images category createdAt"
        ),

      BlogPost.find({ status: "Published", admin })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title shortDescription cover.url createdAt"),

      Agent.find({ admin })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("firstName lastName profilePictureUrl email phone owner"),
    ]);

    return apiResponse(
      "success",
      { forSale, forRent, publishedBlogs, agents },
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
