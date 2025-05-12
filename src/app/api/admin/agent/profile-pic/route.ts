import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import cloudinary from "@/app/lib/cloudinary";
import Agent from "@/app/model/agent";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const agent = await Agent.findOne({ owner: admin._id });

    if (!agent) return apiResponse("Invalid Operation", null, 404);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiResponse("Invalid Operation", null, 400);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const optimizedBuffer = await sharp(fileBuffer)
      .webp({ quality: 50 })
      .resize(1024)
      .toBuffer();

    interface CloudinaryUploadResponse {
      secure_url: string;
      public_id: string;
    }

    const uploadResponse = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "realtyillustrations", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResponse);
            }
          )
          .end(optimizedBuffer);
      }
    );

    if (!uploadResponse || typeof uploadResponse !== "object") {
      throw new Error("Cloudinary upload failed");
    }

    if (agent?.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(agent.cloudinaryPublicId);
    }

    agent.profilePictureUrl = uploadResponse.secure_url;
    agent.cloudinaryPublicId = uploadResponse.public_id;
    await agent.save();

    return apiResponse("Profile Picture Updated", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
