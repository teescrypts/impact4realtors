import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import cloudinary from "@/app/lib/cloudinary";
import BlogPost from "@/app/model/blog";
import Image from "@/app/model/images";
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
    const blog = await BlogPost.findById(_id);
    const draftImgObj = await Image.findOne({
      admin: admin._id,
      status: "drafted",
      type: "blog",
    });

    let draftImg;

    if (draftImgObj) {
      draftImg = {
        url: draftImgObj.url,
        fileName: draftImgObj.filename,
        imageId: draftImgObj._id,
      };
    } else {
      draftImg = "No draft Img";
    }

    return apiResponse("success", { blog, draftImg }, 201);
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
      "title",
      "shortDescription",
      "author",
      "content",
      "estReadTime",
      "cover",
      "status",
    ];

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) return apiResponse("Invalid Operation", null, 401);

    const blog = await BlogPost.findOne({ _id });
    updates.forEach((update) => (blog[update] = body[update]));
    await blog.save();
    await Image.findOneAndUpdate(
      {
        _id: body.cover.imageId,
      },
      { status: "uploaded" }
    );

    return apiResponse("Update saved successfully", null, 201);
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

  const admin = authResponse; 
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const _id = (await params).id;
    const deletedBlogPost = await BlogPost.findByIdAndDelete(_id);

    if (deletedBlogPost?.cover && deletedBlogPost?.cover?.imageId) {
      const deletedImg = await Image.findByIdAndDelete(
        deletedBlogPost.cover.imageId
      );

      if (deletedImg?.public_id) {
        await cloudinary.uploader.destroy(deletedImg.public_id);
      }
    }
    
    return apiResponse("Blog post deleted", null, 201);
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
