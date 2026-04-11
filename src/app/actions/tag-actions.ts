/**
 * Tag Server Actions
 *
 * Server-side actions for fetching tags
 * Uses Next.js caching for optimal performance
 */

"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import apiRequest from "@/app/lib/api-request"; // Adjust path as needed
import { Tag } from "../(pages)/demo/(admin)/dashboard/components/lead/types/lead.types";

// ============================================
// CONFIGURATION
// ============================================

// Cache tags
const CACHE_TAGS = {
  tags: "tags",
  allTags: "all-tags",
} as const;

// ============================================
// HELPER: GET AUTH TOKEN
// ============================================

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  return tokenObj?.value;
}

// ============================================
// FETCH ACTIONS
// ============================================

/**
 * Get all tags (system + custom)
 * Uses Next.js cache with revalidation
 */
export async function getTags(): Promise<{ data: Tag[] }> {
  try {
    const token = await getAuthToken();

    const response = await apiRequest<{ data: Tag[] }>("admin/tags", {
      method: "GET",
      token,
      tag: CACHE_TAGS.allTags,
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    throw new Error(error.message || "Failed to fetch tags");
  }
}

/**
 * Get system tags only
 */
export async function getSystemTags(): Promise<{ data: { tags: Tag[] } }> {
  try {
    const token = await getAuthToken();

    const response = await apiRequest<{ data: { tags: Tag[] } }>(
      "admin/tags?system=true",
      {
        method: "GET",
        token,
        tag: CACHE_TAGS.tags,
      },
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching system tags:", error);
    throw new Error(error.message || "Failed to fetch system tags");
  }
}

/**
 * Get custom tags only
 */
export async function getCustomTags(): Promise<{ data: { tags: Tag[] } }> {
  try {
    const token = await getAuthToken();

    const response = await apiRequest<{ data: { tags: Tag[] } }>(
      "admin/tags?custom=true",
      {
        method: "GET",
        token,
        tag: CACHE_TAGS.tags,
      },
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching custom tags:", error);
    throw new Error(error.message || "Failed to fetch custom tags");
  }
}

// ============================================
// MUTATION ACTIONS (for future use)
// ============================================

/**
 * Create a custom tag
 * (Only if you want to allow custom tag creation)
 */
export async function createCustomTag(tagData: {
  name: string;
  category: "buyer" | "seller" | "inquiry";
  color: string;
  description?: string;
}) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: Tag }, typeof tagData>(
      "admin/tags",
      {
        method: "POST",
        data: tagData,
        token,
      },
    );

    // Revalidate tag cache
    revalidateTag(CACHE_TAGS.allTags, "max");
    revalidateTag(CACHE_TAGS.tags, "max");

    return {
      success: true,
      data: result.data,
      message: "Custom tag created successfully",
    };
  } catch (error: any) {
    console.error("Error creating custom tag:", error);
    return {
      success: false,
      error: error.message || "Failed to create custom tag",
    };
  }
}

/**
 * Update a custom tag
 */
export async function updateCustomTag(tagId: string, updates: Partial<Tag>) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: Tag }, Partial<Tag>>(
      `admin/tags/${tagId}`,
      {
        method: "PATCH",
        data: updates,
        token,
      },
    );

    // Revalidate tag cache
    revalidateTag(CACHE_TAGS.allTags, "max");
    revalidateTag(CACHE_TAGS.tags, "max");

    return {
      success: true,
      data: result.data,
      message: "Custom tag updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating custom tag:", error);
    return {
      success: false,
      error: error.message || "Failed to update custom tag",
    };
  }
}

/**
 * Delete a custom tag
 */
export async function deleteCustomTag(tagId: string) {
  try {
    const token = await getAuthToken();

    await apiRequest(`admin/tags/${tagId}`, {
      method: "DELETE",
      token,
    });

    // Revalidate tag cache
    revalidateTag(CACHE_TAGS.allTags, "max");
    revalidateTag(CACHE_TAGS.tags, "max");

    return {
      success: true,
      message: "Custom tag deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting custom tag:", error);
    return {
      success: false,
      error: error.message || "Failed to delete custom tag",
    };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Manually revalidate tag caches
 */
export async function revalidateTags() {
  revalidateTag(CACHE_TAGS.allTags, "max");
  revalidateTag(CACHE_TAGS.tags, "max");
}
