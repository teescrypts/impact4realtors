/**
 * PATCH /api/admin/tags/reorder
 * Reorder tags within a category
 *
 * Supports reordering both system and custom tags
 * System tags CAN be reordered (only restriction is edit/delete)
 *
 * Body:
 * {
 *   category: "buyer" | "seller",
 *   updates: [
 *     { id: "tag_id_1", order: 0 },
 *     { id: "tag_id_2", order: 1 },
 *     ...
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import mongoose from "mongoose";
import Tag from "@/app/model/Tag";

export async function PATCH(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAgent = admin.agent?.isAgent === true;

    const body = await req.json();
    const { category, updates } = body;

    // Validation
    if (!category || !["buyer", "seller"].includes(category)) {
      return NextResponse.json(
        { error: "Valid category (buyer or seller) is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: "Updates array is required and cannot be empty" },
        { status: 400 },
      );
    }

    // Validate each update
    for (const update of updates) {
      if (!update.id || typeof update.order !== "number") {
        return NextResponse.json(
          { error: "Each update must have id and order" },
          { status: 400 },
        );
      }

      if (!mongoose.Types.ObjectId.isValid(update.id)) {
        return NextResponse.json(
          { error: `Invalid tag ID: ${update.id}` },
          { status: 400 },
        );
      }
    }

    // Fetch all tags being reordered to verify ownership
    const tagIds = updates.map((u) => u.id);
    const tags = await Tag.find({
      _id: { $in: tagIds },
      category,
      $or: [{ isSystem: true }, { [isAgent ? "agent" : "admin"]: admin._id }],
    });

    if (tags.length !== tagIds.length) {
      return NextResponse.json(
        { error: "Some tags were not found or you don't have access to them" },
        { status: 404 },
      );
    }

    // Perform bulk update
    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { order: update.order } },
      },
    }));

    const result = await Tag.bulkWrite(bulkOps);

    // Fetch updated tags
    const updatedTags = await Tag.find({
      category,
      $or: [{ isSystem: true }, { [isAgent ? "agent" : "admin"]: admin._id }],
    }).sort({ order: 1 });

    return NextResponse.json({
      success: true,
      message: "Tags reordered successfully",
      modifiedCount: result.modifiedCount,
      data: updatedTags,
    });
  } catch (error: any) {
    console.error("Error reordering tags:", error);
    return NextResponse.json(
      { error: "Failed to reorder tags", details: error.message },
      { status: 500 },
    );
  }
}
