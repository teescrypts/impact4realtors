/**
 * GET /api/admin/tags/[id]
 * Get a single tag
 *
 * PATCH /api/admin/tags/[id]
 * Update a custom tag (blocks system tags except for order updates via reorder endpoint)
 *
 * DELETE /api/admin/tags/[id]
 * Delete a custom tag (blocks system tags and tags in use)
 */

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import mongoose from "mongoose";
import Tag from "@/app/model/Tag";

/**
 * GET /api/admin/tags/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Find tag (system or admin's custom)
    const tag = await Tag.findOne({
      _id: id,
      $or: [{ isSystem: true }, { admin: admin._id }],
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error: any) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/tags/[id]
 * Update tag (only custom tags can be updated, system tags are protected)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Find tag
    const tag = await Tag.findOne({
      _id: id,
      admin: admin._id, // Only admin's own tags
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found or you don't have permission to edit it" },
        { status: 404 },
      );
    }

    // 🔒 CRITICAL: Block system tags
    if (tag.isSystem) {
      return NextResponse.json(
        {
          error: "System tags cannot be modified",
          suggestion: "System tags are read-only",
        },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { name, color } = body;

    // Update name if provided
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { error: "Tag name cannot be empty" },
          { status: 400 },
        );
      }

      const trimmedName = name.trim();

      // Check for duplicate name (case-insensitive)
      const duplicate = await Tag.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
        category: tag.category,
        $or: [{ admin: admin._id }, { isSystem: true }],
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "A tag with this name already exists in this category" },
          { status: 409 },
        );
      }

      tag.name = trimmedName;
    }

    // Update color if provided
    if (color !== undefined) {
      if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return NextResponse.json(
          { error: "Invalid color format. Must be hex (e.g., #0EA5E9)" },
          { status: 400 },
        );
      }
      tag.color = color;
    }

    await tag.save();

    return NextResponse.json({
      success: true,
      data: tag,
      message: "Tag updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating tag:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update tag", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/tags/[id]
 * Delete custom tag (blocks system tags and tags in use)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let isAgent;

    if (admin.agent.isAgent) {
      isAgent = true;
    }

    const id = (await params).id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid tag ID" }, { status: 400 });
    }

    // Find tag
    const tag = await Tag.findOne({
      _id: id,
      [isAgent ? "agent" : "admin"]: admin._id, // Only admin's own tags
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found or you don't have permission to delete it" },
        { status: 404 },
      );
    }

    // 🔒 CRITICAL: Block system tags
    if (tag.isSystem) {
      return NextResponse.json(
        {
          error: "System tags cannot be deleted",
          suggestion: "System tags are permanent",
        },
        { status: 403 },
      );
    }

    // ⚠️ Check if tag is in use by leads
    const Lead = mongoose.model("Lead");
    const leadsUsingTag = await Lead.countDocuments({ status: tag.name });

    if (leadsUsingTag > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete tag that is currently in use",
          leadsAffected: leadsUsingTag,
          suggestion: "Reassign leads to another tag before deleting",
        },
        { status: 400 },
      );
    }

    // Delete tag
    await Tag.deleteOne({ _id: id });

    // Reorder remaining tags in this category
    const remainingTags = await Tag.find({
      category: tag.category,
      [isAgent ? "agent" : "admin"]: admin._id,
    }).sort({ order: 1 });

    // Update order for remaining custom tags
    const updates = remainingTags.map((t, index) => ({
      updateOne: {
        filter: { _id: t._id },
        update: { $set: { order: index } },
      },
    }));

    if (updates.length > 0) {
      await Tag.bulkWrite(updates);
    }

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
      deletedTag: tag.name,
    });
  } catch (error: any) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag", details: error.message },
      { status: 500 },
    );
  }
}
