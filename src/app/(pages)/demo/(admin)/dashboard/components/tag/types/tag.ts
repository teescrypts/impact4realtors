/**
 * Tag Types
 * 
 * Frontend TypeScript interfaces for tag management
 */

export interface ITag {
  _id: string;
  name: string;
  category: "buyer" | "seller";
  order: number;
  color: string;
  isSystem: boolean;
  admin: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TagCategory = "buyer" | "seller";

// For creating a new tag
export interface CreateTagPayload {
  name: string;
  category: TagCategory;
  color?: string;
}

// For updating a tag
export interface UpdateTagPayload {
  name?: string;
  color?: string;
}

// For reordering tags
export interface ReorderTagsPayload {
  category: TagCategory;
  updates: Array<{
    id: string;
    order: number;
  }>;
}

// API response types
export interface TagResponse {
  success: boolean;
  data: ITag;
  message?: string;
}

export interface TagsResponse {
  success: boolean;
  data: ITag[];
  count: number;
}

export interface DeleteTagResponse {
  success: boolean;
  message: string;
  deletedTag: string;
}

export interface ReorderResponse {
  success: boolean;
  message: string;
  modifiedCount: number;
  data: ITag[];
}

// Error response
export interface TagErrorResponse {
  error: string;
  details?: string;
  suggestion?: string;
  leadsAffected?: number;
  existingTag?: string;
}

// Filters for listing tags
export interface TagFilters {
  category?: TagCategory;
}
