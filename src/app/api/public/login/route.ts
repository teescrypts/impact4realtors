import apiResponse from "@/app/lib/api-response";
import { connectToDB } from "@/app/lib/mongoosejs";
import Admin from "@/app/model/admin";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();

  const { email, password } = body;

  try {
    const user = await Admin.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return apiResponse("Success", { token }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
