import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import Admin from "@/app/model/admin";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    const admin = new Admin({
      email: body.email,
      password: "realtyillustrations.live.98",
    });

    await admin.save();
    const token = await admin.generateAuthToken();

    return apiResponse("success", { token });
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
