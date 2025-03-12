import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const draftImgObj = await Image.findOne({
      admin: admin._id,
      status: "drafted",
      type: "blog",
    }).select("filename url");

    if (!draftImgObj)
      return apiResponse("No draft Image", { draftImg: "No Image" }, 200);

    const draftImg = {
      url: draftImgObj.url,
      fileName: draftImgObj.filename,
      imageId: draftImgObj._id,
    };

    return apiResponse("Fetch succesful", { draftImg }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
