import apiResponse from "@/app/lib/api-response";
import BlogPost from "@/app/model/blog";
import Property from "@/app/model/property";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);

    // Fetch properties and blogs concurrently
    const [forRent, forSale, publishedBlogs] = await Promise.all([
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
    ]);

    return apiResponse("success", { forSale, forRent, publishedBlogs }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
