import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import BlogPost from "@/app/model/blog";
import Image from "@/app/model/images";
import Property from "@/app/model/property";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const image = await Image.findById(id).select("contentType data");

    if (!image) return apiResponse("Image not found", null, 401);

    return new Response(image.data, {
      headers: {
        "Content-Type": image.contentType!,
      },
    });
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

  const _id = (await params).id;
  const searchParams = req.nextUrl.searchParams;
  const propertyId = searchParams.get("property");
  const blogId = searchParams.get("blog");

  try {
    if (propertyId) {
      await Image.findByIdAndDelete({ _id });

      const property = await Property.findById(propertyId).select("images");
      const updatedImgs = property.images.filter(
        (image: { url: string; fileName: string; imageId: string }) => {
          return image.imageId !== _id;
        }
      );

      property.images = updatedImgs;
      await property.save();

      return apiResponse("Image removed", null, 201);
    } else if (blogId) {
      await Image.findByIdAndDelete(_id);

      const blog = await BlogPost.findById(blogId).select("cover status");
      blog.status = "Draft";
      blog.cover = null;

      await blog.save();

      return apiResponse("Image removed", null, 201);
    } else {
      await Image.findByIdAndDelete({ _id });
      return apiResponse("draft Image removed", null, 201);
    }
  } catch (e) {
    return apiResponse(
      e instanceof Error ? e.message : "An unknown error occurred",
      null,
      500
    );
  }
}
