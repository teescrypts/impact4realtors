import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import cloudinary from "@/app/lib/cloudinary";
import Image from "@/app/model/images";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

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

    const optimizedBuffer = await sharp(fileBuffer)
      .webp({ quality: 50 }) // Adjust quality (e.g., 50 for balance between size & quality)
      .resize(1024) // Resize to max width 1024px while maintaining aspect ratio
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

    const image = new Image({
      admin: admin._id,
      filename: file.name,
      contentType: "image/webp",
      status: "drafted",
      type,
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
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
  if (authResponse instanceof NextResponse) return authResponse;

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
    }).select("filename url");

    const draftImages = draftImageArr.map((img) => {
      return {
        url: img.url,
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
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { imageIds } = await req.json(); // Array of image IDs to delete
    if (!imageIds || !Array.isArray(imageIds)) {
      return apiResponse("Invalid request", null, 400);
    }

    // Fetch images from MongoDB to get their public_id
    const images = await Image.find({ _id: { $in: imageIds } });

    if (images.length === 0) {
      return apiResponse("No images found", null, 404);
    }

    // Extract Cloudinary public IDs
    const publicIds = images.map((img) => img.public_id);

    // Delete images from Cloudinary
    const cloudinaryResponse = await cloudinary.api.delete_resources(publicIds);

    // Check if deletion was successful
    if (!cloudinaryResponse || cloudinaryResponse.deleted_count === 0) {
      return apiResponse("Cloudinary deletion failed", null, 500);
    }

    // Delete images from MongoDB
    await Image.deleteMany({ _id: { $in: imageIds } });

    return apiResponse("Images deleted successfully", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
