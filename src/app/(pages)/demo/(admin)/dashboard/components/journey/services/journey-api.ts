/**
 * Journey API Client
 *
 * Complete API client for all journey-related operations.
 * Uses server actions for authentication and data fetching.
 */

import {
  IJourney,
  IJourneyWithStats,
  CreateJourneyPayload,
  UpdateJourneyPayload,
  JourneyFilters,
  DashboardStats,
} from "../types/api";
import {
  activateJourney,
  createJourney,
  deactivateJourney,
  deleteJourney,
  duplicateJourney,
  geJourneytStats,
  listJourney,
  listJourneys,
  updateJourney,
} from "@/app/actions/server-actions";

class JourneyAPIClient {
  private endpoint = "admin/journeys";

  /**
   * Handle server action response and extract data
   * Server actions return { data, error } format
   */
  private handleResponse<T>(response: any): T {
    // Check if response has error
    if (response?.error) {
      throw new Error(response.error);
    }

    // Return the data
    if (response?.data) {
      return response.data as T;
    }

    // If no data property, return response directly
    return response as T;
  }

  /**
   * GET /api/journeys
   * List all journeys with optional filters
   */
  async list(filters?: JourneyFilters): Promise<IJourney[]> {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.set("status", filters.status);
    }
    if (filters?.contactType) {
      params.set("contactType", filters.contactType);
    }
    if (filters?.leadIntent) {
      params.set("leadIntent", filters.leadIntent);
    }

    const url = params.toString()
      ? `${this.endpoint}?${params.toString()}`
      : `${this.endpoint}`;

    const response = await listJourneys(url);
    return this.handleResponse<IJourney[]>(response);
  }

  /**
   * GET /api/journeys/[id]
   * Get a single journey by ID
   */
  async get(
    id: string,
    includeStats = false
  ): Promise<IJourney | IJourneyWithStats> {
    const params = includeStats ? "?includeStats=true" : "";
    const url = `${this.endpoint}/${id}${params}`;
    
    const response = await listJourney(url);
    return this.handleResponse<IJourney | IJourneyWithStats>(response);
  }

  /**
   * POST /api/journeys
   * Create a new journey
   */
  async create(payload: CreateJourneyPayload): Promise<IJourney> {
    const url = `${this.endpoint}`;
    const response = await createJourney(url, payload);
    return this.handleResponse<IJourney>(response);
  }

  /**
   * PATCH /api/journeys/[id]
   * Update an existing journey
   */
  async update(id: string, payload: UpdateJourneyPayload): Promise<IJourney> {
    const url = `${this.endpoint}/${id}`;
    const response = await updateJourney(url, payload);
    return this.handleResponse<IJourney>(response);
  }

  /**
   * DELETE /api/journeys/[id]
   * Delete a journey
   */
  async delete(id: string, force = false): Promise<void> {
    const params = force ? "?force=true" : "";
    const url = `${this.endpoint}/${id}${params}`;
    
    const response = await deleteJourney(url);
    this.handleResponse<void>(response);
  }

  /**
   * POST /api/journeys/[id]/activate
   * Activate a journey
   */
  async activate(id: string): Promise<IJourney> {
    const url = `${this.endpoint}/${id}/activate`;
    const response = await activateJourney(url);
    return this.handleResponse<IJourney>(response);
  }

  /**
   * POST /api/journeys/[id]/deactivate
   * Deactivate a journey
   */
  async deactivate(id: string, pauseActive = false): Promise<IJourney> {
    const params = pauseActive ? "?pauseActive=true" : "";
    const url = `${this.endpoint}/${id}/deactivate${params}`;
    
    const response = await deactivateJourney(url);
    return this.handleResponse<IJourney>(response);
  }

  /**
   * POST /api/journeys/[id]/duplicate
   * Duplicate a journey
   */
  async duplicate(id: string, name?: string): Promise<IJourney> {
    const url = `${this.endpoint}/${id}/duplicate`;
    const response = await duplicateJourney(url, name);
    return this.handleResponse<IJourney>(response);
  }

  /**
   * GET /api/journeys/stats
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const url = `${this.endpoint}/stats`;
    const response = await geJourneytStats(url);
    return this.handleResponse<DashboardStats>(response);
  }
}

// Export singleton instance
export const journeyAPI = new JourneyAPIClient();

// Also export the class for testing
export { JourneyAPIClient };
