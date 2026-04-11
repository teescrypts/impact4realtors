import apiResponse from "@/app/lib/api-response";
import { handleTagAssignment } from "@/app/lib/execution-engine/entry-handler";
import HomeValuationRequest from "@/app/model/home-valuation-request";
import Lead from "@/app/model/lead";
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
      agent,
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

    const newLead = new Lead({
      admin,
      ...(agent && { agent }),
      category: "Seller",
      intent: "Home valuation",
      status: "needs valuation",
      firstName,
      lastName,
      email,
      phone,
      source: "website",
    });

    await newLead.save();

    await HomeValuationRequest.create({
      admin,
      lead: newLead._id,
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

    await handleTagAssignment(newLead._id, newLead.status);

    // Create admin notification
    await Notification.create({
      admin,
      ...(agent && { agent }),
      recipientType: "admin",
      type: "new_home_valuation",
      message: `New home valuation request from ${firstName} ${lastName} (${purpose}).`,
    });

    return apiResponse(
      "Home valuation request submitted successfully",
      null,
      201,
    );
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500,
    );
  }
}
