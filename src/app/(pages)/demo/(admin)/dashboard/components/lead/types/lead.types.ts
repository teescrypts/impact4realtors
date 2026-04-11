/**
 * Lead Management Types - Automation Ready
 * 
 * Updated to support journey automation, inquiry category,
 * and 26 system tags
 */

// ======================
//  LEAD CLASSIFICATION
// ======================

export type LeadCategory = "buyer" | "seller" | "inquiry";

export type LeadIntent =
  | "House Tour"
  | "Mortgage Inquiry"
  | "Buyer Guide"
  | "Sell Call Appointment"
  | "Home valuation"
  | "General Inquiry"
  | null; // For general inquiries without specific intent

export type BuyerProfile = "First-Time Buyer" | "Repeat Buyer" | "Investor";

// ======================
//  SYSTEM TAGS (26 TOTAL)
// ======================

// Buyer Tags (13)
export type BuyerTag =
  | "new lead"
  | "contacted"
  | "needs consultation"
  | "pre-approval in progress"
  | "pre-approved"
  | "property viewing scheduled"
  | "viewed property"
  | "actively searching"
  | "offer made"
  | "under negotiation"
  | "closed deal"
  | "cold lead"
  | "lost lead";

// Seller Tags (13)
export type SellerTag =
  | "new lead"
  | "contacted"
  | "needs valuation"
  | "valuation report sent"
  | "considering listing"
  | "ready to list"
  | "staging & photography"
  | "property listed"
  | "offer received"
  | "under contract"
  | "sold"
  | "cold lead"
  | "lost lead";

// Combined system tags
export type SystemTag = BuyerTag | SellerTag;

// Tag with metadata from DB
export interface Tag {
  _id: string;
  name: SystemTag | string; // System tag or custom tag
  category: LeadCategory;
  color: string;
  isSystem: boolean; // True for 26 system tags
  description?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ======================
//  JOURNEY TYPES
// ======================

export type JourneyStatus = "active" | "completed" | "paused" | "failed";

export type NodeType =
  | "entry"
  | "condition"
  | "delay"
  | "trigger"
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder";

export interface JourneyReference {
  _id: string;
  name: string;
  contactType: LeadCategory;
  leadIntent: LeadIntent;
  isBuiltIn: boolean;
}

export interface JourneyProgress {
  _id: string;
  status: JourneyStatus;
  currentNodeId: string;
  currentNodeType: NodeType;
  progressPercentage: number;
  totalNodes: number;
  completedNodes: number;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  failedAt?: Date;
}

export interface ScheduledAction {
  _id: string;
  type: "send_email" | "call_reminder" | "meeting_reminder" | "sms_reminder";
  scheduledFor: Date;
  nodeId: string;
  description: string;
  title?: string;
  status: "pending" | "executed" | "failed" | "cancelled";
}

// ======================
//  LEAD INTERFACE
// ======================

export interface Lead {
  _id: string;

  // Ownership
  admin: string;
  agent?: string;

  // Classification
  category: LeadCategory;
  intent: LeadIntent;
  buyerProfile?: BuyerProfile;
  status: SystemTag | string; // Current tag (system or custom)

  // Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Journey Automation (NEW)
  currentJourney?: JourneyReference;
  journeyProgress?: JourneyProgress;
  nextScheduledAction?: ScheduledAction;

  // Context
  propertyId?: string;
  source?: string;
  notes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ======================
//  UI STATE TYPES
// ======================

export type LeadViewMode = "table" | "board" | "list";

export interface LeadFilters {
  category?: LeadCategory;
  intent?: LeadIntent;
  status?: string;
  journeyId?: string;
  hasJourney?: boolean;
  progressRange?: [number, number]; // e.g., [0, 25] for 0-25%
  search?: string;
}

export interface LeadSort {
  field: keyof Lead | "journeyProgress" | "nextAction";
  order: "asc" | "desc";
}

// ======================
//  API RESPONSE TYPES
// ======================

export interface LeadsResponse {
  data: {
    leads: Lead[];
    hasMore: boolean;
    lastCreatedAt: Date | null;
    total: number;
  };
}

export interface TagsResponse {
  data: {
    tags: Tag[];
  };
}

export interface UpdateLeadStatusPayload {
  status: string;
}

export interface UpdateLeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
  agent?: string;
  category?: LeadCategory;
  intent?: LeadIntent;
  buyerProfile?: BuyerProfile;
}

export interface CreateLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: LeadCategory;
  intent: LeadIntent;
  status: string;
  buyerProfile?: BuyerProfile;
  propertyId?: string;
  source?: string;
  notes?: string;
}

// ======================
//  HELPER TYPES
// ======================

export interface LeadWithSelection extends Lead {
  isSelected?: boolean;
}

export type LeadActionType =
  | "view"
  | "edit"
  | "email"
  | "call"
  | "note"
  | "journey"
  | "delete";
