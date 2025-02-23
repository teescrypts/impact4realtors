import { authMiddleware } from "@/app/lib/_middleware";
import apiResponse from "@/app/lib/api-response";
import Image from "@/app/model/images";
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
  if (authResponse.status === 401) return authResponse; // Return if unauthorized

  const admin = authResponse; // Retrieve user ID
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const property = searchParams.get("property");

  try {
    if (property) {
      // Delete image from property
    } else {
      const _id = (await params).id;
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
