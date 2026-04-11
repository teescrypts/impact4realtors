/**
 * Tag Management Hooks
 * 
 * React hooks for fetching and managing tags
 */

import { useState, useEffect, useCallback } from "react";
import { tagAPI } from "../services/tag-api";
import { CreateTagPayload, ITag, ReorderTagsPayload, TagCategory, TagFilters, UpdateTagPayload } from "../../types/tag";


/**
 * Hook for fetching tags list
 */
export function useTags(filters?: TagFilters) {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagAPI.list(filters);
      setTags(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tags");
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Only re-fetch if category changes

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
  };
}

/**
 * Hook for fetching a single tag
 */
export function useTag(id: string | null) {
  const [tag, setTag] = useState<ITag | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTag(null);
      return;
    }

    const fetchTag = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await tagAPI.get(id);
        setTag(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tag");
        console.error("Error fetching tag:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [id]);

  return { tag, loading, error };
}

/**
 * Hook for tag mutations (create, update, delete, reorder)
 */
export function useTagMutations() {
  const [loading, setLoading] = useState(false);

  const create = async (payload: CreateTagPayload): Promise<ITag> => {
    try {
      setLoading(true);
      const tag = await tagAPI.create(payload);
      return tag;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, payload: UpdateTagPayload): Promise<ITag> => {
    try {
      setLoading(true);
      const tag = await tagAPI.update(id, payload);
      return tag;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await tagAPI.delete(id);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reorder = async (payload: ReorderTagsPayload): Promise<ITag[]> => {
    try {
      setLoading(true);
      const tags = await tagAPI.reorder(payload);
      return tags;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    update,
    delete: deleteTag,
    reorder,
    loading,
  };
}

/**
 * Hook for filtering tags by category
 */
export function useTagsByCategory(tags: ITag[], category: TagCategory) {
  return tags
    .filter((tag) => tag.category === category)
    .sort((a, b) => a.order - b.order);
}

/**
 * Hook for separating system and custom tags
 */
export function useTagsSeparated(tags: ITag[], category?: TagCategory) {
  const filtered = category
    ? tags.filter((tag) => tag.category === category)
    : tags;

  const systemTags = filtered
    .filter((tag) => tag.isSystem)
    .sort((a, b) => a.order - b.order);

  const customTags = filtered
    .filter((tag) => !tag.isSystem)
    .sort((a, b) => a.order - b.order);

  return {
    systemTags,
    customTags,
    allTags: [...systemTags, ...customTags],
  };
}
