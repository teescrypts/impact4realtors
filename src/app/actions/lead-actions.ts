/**
 * Lead Server Actions
 *
 * Server-side mutations for leads with cache revalidation
 * Uses Next.js Server Actions for optimal performance
 */

"use server";

import { cookies } from "next/headers";
import { updateTag as nextUpdateTag, revalidatePath } from "next/cache";
import apiRequest from "@/app/lib/api-request"; // Adjust path as needed
import {
  CreateLeadPayload,
  Lead,
  LeadCategory,
} from "../(pages)/demo/(admin)/dashboard/components/lead/types/lead.types";

// ============================================
// CONFIGURATION
// ============================================

// Cache tags for revalidation
const CACHE_TAGS = {
  leads: (category?: LeadCategory) =>
    category ? `leads-${category}` : "leads",
  allLeads: "leads",
  tags: "tags",
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
// FETCH ACTIONS (with caching)
// ============================================

/**
 * Get leads by category
 * Uses Next.js cache with tags for revalidation
 */
export async function getLeads(category: LeadCategory): Promise<{
  data: { leads: Lead[]; hasMore: boolean; lastCreatedAt: Date | null };
}> {
  try {
    const token = await getAuthToken();
    const capitalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    const response = await apiRequest<{
      data: { leads: Lead[]; hasMore: boolean; lastCreatedAt: Date | null };
    }>(`admin/lead?type=${capitalizedCategory}`, {
      method: "GET",
      token,
      tag: CACHE_TAGS.leads(category),
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    throw new Error(error.message || "Failed to fetch leads");
  }
}

/**
 * Get all leads (no category filter)
 */
export async function getAllLeads(): Promise<{
  data: { leads: Lead[]; hasMore: boolean; lastCreatedAt: Date | null };
}> {
  try {
    const token = await getAuthToken();

    const response = await apiRequest<{
      data: { leads: Lead[]; hasMore: boolean; lastCreatedAt: Date | null };
    }>("admin/lead", {
      method: "GET",
      token,
      tag: CACHE_TAGS.allLeads,
    });

    return response;
  } catch (error: any) {
    console.error("Error fetching all leads:", error);
    throw new Error(error.message || "Failed to fetch all leads");
  }
}

// ============================================
// MUTATION ACTIONS (with revalidation)
// ============================================

/**
 * Create a new lead
 * Triggers journey automation via backend
 */
export async function createLead(payload: CreateLeadPayload) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: Lead }, CreateLeadPayload>(
      "admin/lead",
      {
        method: "POST",
        data: payload,
        token,
      },
    );

    // Revalidate all lead caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(payload.category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      data: result.data,
      message: "Lead created successfully",
    };
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return {
      success: false,
      error: error.message || "Failed to create lead",
    };
  }
}

/**
 * Update lead status (tag)
 * This triggers journey automation via handleTagAssignment
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  category: LeadCategory,
) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: Lead }, { status: string }>(
      `admin/lead/${leadId}`,
      {
        method: "PATCH",
        data: { status: newStatus },
        token,
      },
    );

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      data: result.data,
      message: "Lead status updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return {
      success: false,
      error: error.message || "Failed to update lead status",
    };
  }
}

/**
 * Update lead fields (general update)
 */
export async function updateLead(
  leadId: string,
  updates: Partial<Lead>,
  category: LeadCategory,
) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: Lead }, Partial<Lead>>(
      `admin/lead/${leadId}`,
      {
        method: "PATCH",
        data: updates,
        token,
      },
    );

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      data: result.data,
      message: "Lead updated successfully",
    };
  } catch (error: any) {
    console.error("Error updating lead:", error);
    return {
      success: false,
      error: error.message || "Failed to update lead",
    };
  }
}

/**
 * Delete a single lead
 */
export async function deleteLead(leadId: string, category: LeadCategory) {
  try {
    const token = await getAuthToken();

    await apiRequest(`admin/lead/${leadId}`, {
      method: "DELETE",
      token,
    });

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      message: "Lead deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return {
      success: false,
      error: error.message || "Failed to delete lead",
    };
  }
}

/**
 * Bulk delete leads
 */
export async function bulkDeleteLeads(
  leadIds: string[],
  category: LeadCategory,
) {
  try {
    const token = await getAuthToken();

    // Delete leads in parallel
    const results = await Promise.allSettled(
      leadIds.map((id) =>
        apiRequest(`admin/lead/${id}`, {
          method: "DELETE",
          token,
        }),
      ),
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.filter((r) => r.status === "rejected").length;

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: failCount === 0,
      successCount,
      failCount,
      message:
        failCount === 0
          ? `Successfully deleted ${successCount} leads`
          : `Deleted ${successCount} leads, ${failCount} failed`,
    };
  } catch (error: any) {
    console.error("Error bulk deleting leads:", error);
    return {
      success: false,
      error: error.message || "Failed to delete leads",
    };
  }
}

// ============================================
// JOURNEY ACTIONS
// ============================================

/**
 * Pause a lead's journey
 */
export async function pauseLeadJourney(leadId: string, category: LeadCategory) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: any }>(
      `admin/lead/${leadId}/journey/pause`,
      {
        method: "POST",
        token,
      },
    );

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      data: result.data,
      message: "Journey paused successfully",
    };
  } catch (error: any) {
    console.error("Error pausing journey:", error);
    return {
      success: false,
      error: error.message || "Failed to pause journey",
    };
  }
}

/**
 * Resume a lead's journey
 */
export async function resumeLeadJourney(
  leadId: string,
  category: LeadCategory,
) {
  try {
    const token = await getAuthToken();

    const result = await apiRequest<{ data: any }>(
      `admin/lead/${leadId}/journey/resume`,
      {
        method: "POST",
        token,
      },
    );

    // Revalidate caches
    nextUpdateTag(CACHE_TAGS.allLeads);
    nextUpdateTag(CACHE_TAGS.leads(category));
    revalidatePath("/dashboard/lead");

    return {
      success: true,
      data: result.data,
      message: "Journey resumed successfully",
    };
  } catch (error: any) {
    console.error("Error resuming journey:", error);
    return {
      success: false,
      error: error.message || "Failed to resume journey",
    };
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Manually revalidate lead caches
 * Useful for external triggers
 */
export async function revalidateLeads(category?: LeadCategory) {
  if (category) {
    nextUpdateTag(CACHE_TAGS.leads(category));
  } else {
    nextUpdateTag(CACHE_TAGS.allLeads);
  }
  revalidatePath("/dashboard/lead");
}
