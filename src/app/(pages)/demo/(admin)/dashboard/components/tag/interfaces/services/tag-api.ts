/**
 * Tag API Client
 *
 * Complete API client for tag management operations
 * Uses server actions for authentication
 */

// Import your server actions
import {
  listTags,
  getTag,
  createTag as createTagAction,
  updateTag as updateTagAction,
  deleteTag as deleteTagAction,
  reorderTags as reorderTagsAction,
} from "@/app/actions/server-actions"; // Adjust path as needed
import {
  TagFilters,
  ITag,
  CreateTagPayload,
  UpdateTagPayload,
  DeleteTagResponse,
  ReorderTagsPayload,
} from "../../types/tag";

class TagAPIClient {
  private endpoint = "admin/tags";

  /**
   * Handle API response and extract data
   */
  private handleResponse<T>(response: any): T {
    if (response?.error) {
      throw new Error(response.error);
    }

    if (response?.data) {
      return response.data as T;
    }

    return response as T;
  }

  /**
   * GET /api/admin/tags
   * List all tags (system + custom)
   */
  async list(filters?: TagFilters): Promise<ITag[]> {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.set("category", filters.category);
    }

    const url = params.toString()
      ? `${this.endpoint}?${params.toString()}`
      : `${this.endpoint}`;

    const response = await listTags(url);
    return this.handleResponse<ITag[]>(response);
  }

  /**
   * GET /api/admin/tags/[id]
   * Get a single tag by ID
   */
  async get(id: string): Promise<ITag> {
    const url = `${this.endpoint}/${id}`;
    const response = await getTag(url);
    return this.handleResponse<ITag>(response);
  }

  /**
   * POST /api/admin/tags
   * Create a new custom tag
   */
  async create(payload: CreateTagPayload): Promise<ITag> {
    const url = `${this.endpoint}`;
    const response = await createTagAction(url, payload);
    return this.handleResponse<ITag>(response);
  }

  /**
   * PATCH /api/admin/tags/[id]
   * Update a custom tag
   */
  async update(id: string, payload: UpdateTagPayload): Promise<ITag> {
    const url = `${this.endpoint}/${id}`;
    const response = await updateTagAction(url, payload);
    return this.handleResponse<ITag>(response);
  }

  /**
   * DELETE /api/admin/tags/[id]
   * Delete a custom tag
   */
  async delete(id: string): Promise<DeleteTagResponse> {
    const url = `${this.endpoint}/${id}`;
    const response = await deleteTagAction(url);
    return this.handleResponse<DeleteTagResponse>(response);
  }

  /**
   * PATCH /api/admin/tags/reorder
   * Reorder tags within a category
   */
  async reorder(payload: ReorderTagsPayload): Promise<ITag[]> {
    const url = `${this.endpoint}/reorder`;
    const response = await reorderTagsAction(url, payload);
    return this.handleResponse<ITag[]>(response);
  }
}

// Export singleton instance
export const tagAPI = new TagAPIClient();

// Also export the class for testing
export { TagAPIClient };
