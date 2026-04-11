/**
 * Lead Management Store (Zustand)
 * 
 * Manages lead state, filters, selection, and view mode
 * FIXED: Case-insensitive category filtering
 */

import { create } from "zustand";
import {
  Lead,
  LeadCategory,
  LeadFilters,
  LeadSort,
  LeadViewMode,
  Tag,
} from "../types/lead.types";

interface LeadManagementState {
  // Data
  leads: Lead[];
  tags: Tag[];
  
  // UI State
  viewMode: LeadViewMode;
  selectedCategory: LeadCategory;
  selectedLeads: string[];
  filters: LeadFilters;
  sort: LeadSort;
  
  // Loading & Pagination
  isLoading: boolean;
  hasMore: boolean;
  lastCreatedAt: Date | null;
  
  // Detail Panel
  detailPanelLeadId: string | null;
  
  // Actions - Data
  setLeads: (leads: Lead[]) => void;
  addLeads: (leads: Lead[]) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  removeLead: (leadId: string) => void;
  setTags: (tags: Tag[]) => void;
  
  // Actions - UI
  setViewMode: (mode: LeadViewMode) => void;
  setSelectedCategory: (category: LeadCategory) => void;
  toggleLeadSelection: (leadId: string) => void;
  selectAllLeads: () => void;
  clearSelection: () => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  clearFilters: () => void;
  setSort: (sort: LeadSort) => void;
  
  // Actions - Detail Panel
  openDetailPanel: (leadId: string) => void;
  closeDetailPanel: () => void;
  
  // Actions - Pagination
  setHasMore: (hasMore: boolean) => void;
  setLastCreatedAt: (date: Date | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Computed
  getFilteredLeads: () => Lead[];
  getSortedLeads: (leads: Lead[]) => Lead[];
  getSelectedLeadsData: () => Lead[];
}

export const useLeadStore = create<LeadManagementState>((set, get) => ({
  // Initial State
  leads: [],
  tags: [],
  viewMode: "table", // Default to table view
  selectedCategory: "buyer",
  selectedLeads: [],
  filters: {},
  sort: {
    field: "createdAt",
    order: "desc",
  },
  isLoading: false,
  hasMore: false,
  lastCreatedAt: null,
  detailPanelLeadId: null,

  // Data Actions
  setLeads: (leads) => set({ leads }),
  
  addLeads: (newLeads) =>
    set((state) => ({
      leads: [...state.leads, ...newLeads],
    })),
  
  updateLead: (leadId, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead._id === leadId ? { ...lead, ...updates } : lead
      ),
    })),
  
  removeLead: (leadId) =>
    set((state) => ({
      leads: state.leads.filter((lead) => lead._id !== leadId),
      selectedLeads: state.selectedLeads.filter((id) => id !== leadId),
    })),
  
  setTags: (tags) => set({ tags }),

  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setSelectedCategory: (category) =>
    set({
      selectedCategory: category,
      selectedLeads: [], // Clear selection when changing category
      filters: {}, // Clear filters when changing category
    }),
  
  toggleLeadSelection: (leadId) =>
    set((state) => ({
      selectedLeads: state.selectedLeads.includes(leadId)
        ? state.selectedLeads.filter((id) => id !== leadId)
        : [...state.selectedLeads, leadId],
    })),
  
  selectAllLeads: () =>
    set(() => ({
     
      selectedLeads: get()
        .getFilteredLeads()
        .map((lead) => lead._id),
    })),
  
  clearSelection: () => set({ selectedLeads: [] }),
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  clearFilters: () => set({ filters: {} }),
  
  setSort: (sort) => set({ sort }),

  // Detail Panel Actions
  openDetailPanel: (leadId) => set({ detailPanelLeadId: leadId }),
  
  closeDetailPanel: () => set({ detailPanelLeadId: null }),

  // Pagination Actions
  setHasMore: (hasMore) => set({ hasMore }),
  
  setLastCreatedAt: (date) => set({ lastCreatedAt: date }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Computed Functions
  getFilteredLeads: () => {
    const state = get();
    let filtered = state.leads;

    // ✅ FIXED: Filter by category (case-insensitive)
    // Handles DB returning "Buyer"/"Seller"/"Inquiry" vs frontend using "buyer"/"seller"/"inquiry"
    if (state.selectedCategory) {
      filtered = filtered.filter(
        (lead) => lead.category.toLowerCase() === state.selectedCategory.toLowerCase()
      );
    }

    // Apply additional filters
    const { filters } = state;

    if (filters.intent !== undefined) {
      filtered = filtered.filter((lead) => lead.intent === filters.intent);
    }

    if (filters.status) {
      filtered = filtered.filter((lead) => lead.status === filters.status);
    }

    if (filters.journeyId) {
      filtered = filtered.filter(
        (lead) => lead.currentJourney?._id === filters.journeyId
      );
    }

    if (filters.hasJourney !== undefined) {
      filtered = filtered.filter((lead) =>
        filters.hasJourney ? !!lead.currentJourney : !lead.currentJourney
      );
    }

    if (filters.progressRange) {
      const [min, max] = filters.progressRange;
      filtered = filtered.filter((lead) => {
        const progress = lead.journeyProgress?.progressPercentage ?? 0;
        return progress >= min && progress <= max;
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(searchLower) ||
          lead.lastName.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.phone.includes(searchLower) ||
          lead.currentJourney?.name.toLowerCase().includes(searchLower) ||
          lead.notes?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },

  getSortedLeads: (leads) => {
    const { sort } = get();
    
    return [...leads].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Handle special sort fields
      if (sort.field === "journeyProgress") {
        aValue = a.journeyProgress?.progressPercentage ?? 0;
        bValue = b.journeyProgress?.progressPercentage ?? 0;
      } else if (sort.field === "nextAction") {
        aValue = a.nextScheduledAction?.scheduledFor
          ? new Date(a.nextScheduledAction.scheduledFor).getTime()
          : Infinity;
        bValue = b.nextScheduledAction?.scheduledFor
          ? new Date(b.nextScheduledAction.scheduledFor).getTime()
          : Infinity;
      } else {
        aValue = a[sort.field as keyof Lead];
        bValue = b[sort.field as keyof Lead];
      }

      // Handle date comparisons
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }

      // Handle string comparisons
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Compare
      if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
      return 0;
    });
  },

  getSelectedLeadsData: () => {
    const state = get();
    return state.leads.filter((lead) =>
      state.selectedLeads.includes(lead._id)
    );
  },
}));

// Selector hooks for common use cases
export const useLeads = () => useLeadStore((state) => state.leads);
export const useTags = () => useLeadStore((state) => state.tags);
export const useViewMode = () => useLeadStore((state) => state.viewMode);
export const useSelectedCategory = () =>
  useLeadStore((state) => state.selectedCategory);
export const useSelectedLeads = () =>
  useLeadStore((state) => state.selectedLeads);
export const useFilters = () => useLeadStore((state) => state.filters);
export const useSort = () => useLeadStore((state) => state.sort);
export const useDetailPanelLeadId = () =>
  useLeadStore((state) => state.detailPanelLeadId);
export const useFilteredLeads = () =>
  useLeadStore((state) => state.getFilteredLeads());
export const useFilteredAndSortedLeads = () => {
  const getFilteredLeads = useLeadStore((state) => state.getFilteredLeads);
  const getSortedLeads = useLeadStore((state) => state.getSortedLeads);
  return getSortedLeads(getFilteredLeads());
};
