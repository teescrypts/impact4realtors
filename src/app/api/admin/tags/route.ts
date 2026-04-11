/**
 * GET /api/admin/tags
 * List all tags (system + custom for this admin)
 *
 * Query params:
 * - category: "buyer" | "seller" (optional)
 *
 * POST /api/admin/tags
 * Create a new custom tag
 */

import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/lib/_middleware";
import Tag from "@/app/model/Tag";
import { seedSystemTags } from "@/app/utils/seed-system-tags";

/**
 * GET /api/admin/tags
 * List all tags (system + admin's custom tags)
 */
export async function GET(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAgent = admin.agent?.isAgent === true;

    await seedSystemTags(
      isAgent,
      admin.isBroker,
      admin._id as string,
      admin.agent?.admin as string | undefined,
    );

    // Get category from query params
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as "buyer" | "seller" | null;

    // Build query: system tags OR admin's custom tags
    const query: any = {
      $or: [
        { isSystem: true },
        {
          [isAgent ? "agent" : "admin"]: admin._id,
        },
      ],
    };

    if (category) {
      if (!["buyer", "seller"].includes(category)) {
        return NextResponse.json(
          { error: "Invalid category. Must be buyer or seller" },
          { status: 400 },
        );
      }
      query.category = category;
    }

    // Fetch tags sorted by category and order
    const tags = await Tag.find(query).sort({ category: 1, order: 1 }).lean();

    return NextResponse.json({
      success: true,
      data:  tags ,
      count: tags.length,
    });
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/tags
 * Create a new custom tag
 */
export async function POST(req: NextRequest) {
  try {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) return authResponse;

    const admin = authResponse;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAgent = admin.agent?.isAgent === true;

    const body = await req.json();
    const { name, category, color } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 },
      );
    }

    if (!category || !["buyer", "seller"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be buyer or seller" },
        { status: 400 },
      );
    }

    const trimmedName = name.trim();

    // Check for duplicate tag name (case-insensitive)
    const existingTag = await Tag.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      category,
      $or: [
        {
          [isAgent ? "agent" : "admin"]: admin._id,
        },
        { isSystem: true },
      ],
    });

    if (existingTag) {
      return NextResponse.json(
        {
          error: "A tag with this name already exists in this category",
          existingTag: existingTag.name,
        },
        { status: 409 },
      );
    }

    // Get the highest order number for this admin's tags in this category
    const maxOrderTag = await Tag.findOne({
      category,
      $or: [
        {
          [isAgent ? "agent" : "admin"]: admin._id,
        },
        { isSystem: true },
      ],
    })
      .sort({ order: -1 })
      .lean();

    const newOrder = maxOrderTag ? maxOrderTag.order + 1 : 0;

    // Default color based on category
    const defaultColor = category === "buyer" ? "#0EA5E9" : "#F97316";

    // Create tag
    const tag = await Tag.create({
      name: trimmedName,
      category,
      order: newOrder,
      color: color || defaultColor,
      isSystem: false,
      admin: isAgent ? admin.agent.admin : admin._id,
      ...((isAgent || admin.isBroker) && { agent: admin._id }),
    });

    return NextResponse.json(
      {
        success: true,
        data: tag,
        message: "Tag created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating tag:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A tag with this name already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create tag", details: error.message },
      { status: 500 },
    );
  }
}
