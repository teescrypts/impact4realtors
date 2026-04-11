/**
 * Journey Hooks
 * 
 * Custom React hooks for working with journeys.
 * Handles loading states, errors, and data fetching.
 */

import { useState, useEffect, useCallback } from "react";
import { journeyAPI } from "../services/journey-api";
import {
  IJourney,
  JourneyFilters,
  CreateJourneyPayload,
  UpdateJourneyPayload,
  DashboardStats,
} from "../types/api";

/**
 * Hook to fetch and manage list of journeys
 */
export function useJourneys(initialFilters?: JourneyFilters) {
  const [journeys, setJourneys] = useState<IJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JourneyFilters | undefined>(initialFilters);

  const loadJourneys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journeyAPI.list(filters);
      setJourneys(data);
    } catch (err: any) {
      setError(err.message || "Failed to load journeys");
      console.error("Error loading journeys:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  const refetch = useCallback(() => {
    loadJourneys();
  }, [loadJourneys]);

  return {
    journeys,
    loading,
    error,
    filters,
    setFilters,
    refetch,
  };
}

/**
 * Hook to fetch a single journey
 */
export function useJourney(id: string | null, includeStats = false) {
  const [journey, setJourney] = useState<IJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJourney = useCallback(async () => {
    if (!id) {
      setJourney(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await journeyAPI.get(id, includeStats);
      setJourney(data);
    } catch (err: any) {
      setError(err.message || "Failed to load journey");
      console.error("Error loading journey:", err);
    } finally {
      setLoading(false);
    }
  }, [id, includeStats]);

  useEffect(() => {
    loadJourney();
  }, [loadJourney]);

  const refetch = useCallback(() => {
    loadJourney();
  }, [loadJourney]);

  return {
    journey,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for journey mutations (create, update, delete, etc.)
 */
export function useJourneyMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: CreateJourneyPayload) => {
    try {
      setLoading(true);
      setError(null);
      const journey = await journeyAPI.create(payload);
      return journey;
    } catch (err: any) {
      setError(err.message || "Failed to create journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, payload: UpdateJourneyPayload) => {
    try {
      setLoading(true);
      setError(null);
      const journey = await journeyAPI.update(id, payload);
      return journey;
    } catch (err: any) {
      setError(err.message || "Failed to update journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJourney = useCallback(async (id: string, force = false) => {
    try {
      setLoading(true);
      setError(null);
      await journeyAPI.delete(id, force);
    } catch (err: any) {
      setError(err.message || "Failed to delete journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const activate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const journey = await journeyAPI.activate(id);
      return journey;
    } catch (err: any) {
      setError(err.message || "Failed to activate journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivate = useCallback(async (id: string, pauseActive = false) => {
    try {
      setLoading(true);
      setError(null);
      const journey = await journeyAPI.deactivate(id, pauseActive);
      return journey;
    } catch (err: any) {
      setError(err.message || "Failed to deactivate journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicate = useCallback(async (id: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const journey = await journeyAPI.duplicate(id, name);
      return journey;
    } catch (err: any) {
      setError(err.message || "Failed to duplicate journey");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    update,
    delete: deleteJourney,
    activate,
    deactivate,
    duplicate,
    loading,
    error,
  };
}

/**
 * Hook to fetch dashboard stats
 */
export function useJourneyStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journeyAPI.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refetch = useCallback(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
