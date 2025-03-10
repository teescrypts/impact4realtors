import apiResponse from "@/app/lib/api-response";
import Newsletter from "@/app/model/newsletter";
import Notification from "@/app/model/notification";
import getAdmin from "@/app/utils/get-admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdmin(req);
    const body = await req.json();
    const newsLetter = new Newsletter({ admin, ...body });
    await newsLetter.save();

    const notification = new Notification({
      admin,
      recipientType: "admin",
      type: "new_newsletter",
      message:
        "New subscription alert! Someone just signed up for your newsletter.",
    });

    await notification.save();

    return apiResponse("Sign up successfull", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
