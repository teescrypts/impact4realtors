import apiResponse from "@/app/lib/api-response";
import HomeValuationRequest from "@/app/model/home-valuation-request";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const body = await req.json();

    const {
      address,
      bedrooms,
      bathrooms,
      yearBuilt,
      squareFootage,
      purpose,
      firstName,
      lastName,
      email,
      phone,
    } = body;

    // Basic validation
    if (
      !address ||
      !bedrooms ||
      !bathrooms ||
      !yearBuilt ||
      !squareFootage ||
      !purpose ||
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return apiResponse("All fields are required", null, 400);
    }

    await HomeValuationRequest.create({
      admin,
      address,
      bedrooms,
      bathrooms,
      yearBuilt,
      squareFootage,
      purpose,
      firstName,
      lastName,
      email,
      phone,
      status: "Pending",
    });

    // Create admin notification
    await Notification.create({
      admin,
      recipientType: "admin",
      type: "new_home_valuation",
      message: `New home valuation request from ${firstName} ${lastName} (${purpose}).`,
    });

    return apiResponse(
      "Home valuation request submitted successfully",
      null,
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
