import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type");

    if (!file || !type || !(file instanceof File)) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const compressedBuffer = await sharp(fileBuffer)
      .webp({ quality: 30 })
      .toBuffer();

    const image = new Image({
      admin: admin._id,
      filename: file.name,
      contentType: "image/webp",
      status: "drafted",
      type,
      data: compressedBuffer,
    });

    await image.save();

    return apiResponse("Image Uploaded", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function GET(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("type");

  try {
    const draftImageArr = await Image.find({
      admin: admin._id,
      status: "drafted",
      type: query,
    }).select("filename");

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const draftImages = draftImageArr.map((img) => {
      return {
        url: `${apiBaseUrl}/api/admin/${img._id}/image`,
        fileName: img.filename,
        imageId: img._id,
      };
    });

    return apiResponse("success", { draftImages }, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await Image.deleteMany({ admin: admin._id, status: "drafted" });
    return apiResponse("All drafted images deleted", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
