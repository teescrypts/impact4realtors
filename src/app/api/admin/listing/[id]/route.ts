import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
import Property from "@/app/model/property";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;
    const property = await Property.findById(_id);

    if (!property) return apiResponse("invalid operation", null, 401);

    const draftImagesArr = await Image.find({
      admin: admin._id,
      status: "drafted",
      type: "listing",
    });

    const draftImages = draftImagesArr.map((img) => {
      return {
        url: img.url,
        fileName: img.filename,
        imageId: img._id,
      };
    });

    return apiResponse("success", { property, draftImages }, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;
    const body = await req.json();
    const updates = Object.keys(body);
    const allowedUpdates = [
      "propertyTitle",
      "price",
      "bedrooms",
      "bathrooms",
      "squareMeters",
      "description",
      "category",
      "status",
      "location",
      "features",
      "images",
      "propertyType",
    ];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) return apiResponse("Invalid Operation", null, 401);

    const property = await Property.findOne({ _id });

    if (!property) return apiResponse("Invalid Operation", null, 401);

    updates.forEach((update) => (property[update] = body[update]));
    await property.save();
    await Image.updateMany(
      { admin: admin._id, status: "drafted", type: "listing" },
      { status: "uploaded" }
    );

    return apiResponse("success", null, 200);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await authMiddleware(req);
  if (authResponse instanceof NextResponse) return authResponse;

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;
    const deletedProperty = await Property.findByIdAndDelete(_id);

    deletedProperty.images.forEach(
      async (img: { url: string; fileName: string; imageId: string }) => {
        await Image.findByIdAndDelete(img.imageId);
      }
    );

    return apiResponse("Property Deleted", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
