import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse;

  const admin = authResponse;
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const draftImgObj = await Image.findOne({
      admin: admin._id,
      status: "drafted",
      type: "blog",
    }).select("filename");

    if (!draftImgObj)
      return apiResponse("No draft Image", { draftImg: "No Image" }, 200);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const draftImg = {
      url: `${apiBaseUrl}/api/admin/${draftImgObj._id}/image`,
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
