/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest } from "next/server";
import Property from "@/app/model/property";
import apiResponse from "@/app/lib/api-response";
import getAdmin from "@/app/utils/get-admin";

interface PropertyQueryParams {
  category?: "For Sale" | "For Rent";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSquareMeters?: number;
  maxSquareMeters?: number;
  location?: string;
  page: number;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const searchParams = req.nextUrl.searchParams;

    const query: PropertyQueryParams = {
      category: searchParams.get("category") as PropertyQueryParams["category"],
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      bedrooms: searchParams.get("bedrooms")
        ? parseInt(searchParams.get("bedrooms")!)
        : undefined,
      bathrooms: searchParams.get("bathrooms")
        ? parseInt(searchParams.get("bathrooms")!)
        : undefined,
      minSquareMeters: searchParams.get("minSquareMeters")
        ? parseFloat(searchParams.get("minSquareMeters")!)
        : undefined,
      maxSquareMeters: searchParams.get("maxSquareMeters")
        ? parseFloat(searchParams.get("maxSquareMeters")!)
        : undefined,
      location: searchParams.get("location") || undefined, // General location input
      page: Math.max(1, parseInt(searchParams.get("page") ?? "1")),
    };

    const filterConditions: Record<string, unknown> = { admin };

    if (query.category) filterConditions.category = query.category;
    if (query.minPrice || query.maxPrice) {
      filterConditions.price = {};
      if (query.minPrice) (filterConditions.price as any).$gte = query.minPrice;
      if (query.maxPrice) (filterConditions.price as any).$lte = query.maxPrice;
    }
    if (query.bedrooms) filterConditions.bedrooms = query.bedrooms;
    if (query.bathrooms) filterConditions.bathrooms = query.bathrooms;
    if (query.minSquareMeters || query.maxSquareMeters) {
      filterConditions.squareMeters = {};
      if (query.minSquareMeters)
        (filterConditions.squareMeters as any).$gte = query.minSquareMeters;
      if (query.maxSquareMeters)
        (filterConditions.squareMeters as any).$lte = query.maxSquareMeters;
    }

    // Handle generic location input (matches city, state, or country)
    if (query.location) {
      const locationRegex = new RegExp(query.location, "i");
      filterConditions.$or = [
        { "location.cityName": locationRegex },
        { "location.stateName": locationRegex },
        { "location.countryName": locationRegex },
      ];
    }

    const limit = 9;
    const skip = (query.page - 1) * limit;

    // Fetch properties
    const properties = await Property.find(filterConditions)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "propertyTitle bedrooms bathrooms squareMeters status price location images category createdAt"
      );

    const totalCount = await Property.countDocuments(filterConditions);

    return apiResponse(
      "success",
      {
        properties,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: query.page,
      },
      200
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
