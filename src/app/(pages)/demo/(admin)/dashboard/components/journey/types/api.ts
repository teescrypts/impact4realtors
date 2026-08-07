/**
 * Backend API Types
 *
 * These types match the backend API responses exactly.
 * Use these when working with API data.
 */

import { EmailBlock } from "@/app/lib/email/blocks";

// ======================
//  LEAD INTENT
// ======================
export type LeadIntent =
  | "House Tour"
  | "Mortgage Inquiry"
  | "Buyer Guide"
  | "Sell Call Appointment"
  | "Home valuation"
  | "General Inquiry";

// ======================
//  CONTACT TYPE
// ======================
export type ContactType = "buyer" | "seller";

// ======================
//  TAG ACTION
// ======================
export type TagActionType = "assign" | "change";

export interface ITagAction {
  type: TagActionType;
  tagName: string;
  newTagName?: string; // Only for "change" type
}

export interface IEntryAction {
  tagAction: ITagAction;
}

// ======================
//  NODE TYPES
// ======================
export type NodeType =
  | "entry"
  | "condition"
  | "delay"
  | "trigger"
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder";

// ======================
//  NODE CONFIGS
// ======================
export type NodeConfig =
  | { type: "entry" }
  | {
      type: "condition";
      checkType: "email_opened" | "tag_changed";
      description?: string;
      waitFor?: {
        duration: number;
        unit: "minutes" | "hours" | "days";
      };
    }
  | {
      type: "delay";
      duration: number;
      unit: "minutes" | "hours" | "days";
    }
  | {
      type: "trigger";
      waitForTag: string;
      description?: string;
    }
  | {
      type: "send_email";
      subject: string;
      /** Rendered HTML — regenerated from `emailBlocks` whenever blocks exist. */
      emailContent: string;
      /** Structured content; the source of truth when present. */
      emailBlocks?: EmailBlock[];
      fromName?: string;
    }
  | {
      type: "meeting_reminder";
      message: string;
      title?: string;
    }
  | {
      type: "sms_reminder";
      message: string;
    }
  | {
      type: "call_reminder";
      message: string;
      phoneNumber?: string;
    };

// ======================
//  JOURNEY NODE
// ======================
export interface IJourneyNode {
  id: string;
  type: NodeType;
  config: NodeConfig;
  position?: {
    x: number;
    y: number;
  };
}

// ======================
//  JOURNEY EDGE
// ======================
export interface IJourneyEdge {
  id: string;
  source: string;
  target: string;
  label?: "yes" | "no";
}

// ======================
//  JOURNEY (Main API Model)
// ======================
export interface IJourney {
  _id: string; // MongoDB ID
  admin: string;
  name: string;
  contactType: ContactType;
  leadIntent: LeadIntent;
  entryAction: IEntryAction;
  nodes: IJourneyNode[];
  edges: IJourneyEdge[];
  entryNodeId: string;
  isBuiltIn: boolean;
  isActive: boolean;
  isDraft: boolean;
  description?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ======================
//  JOURNEY STATS
// ======================
export interface IJourneyStats {
  active: number;
  completed: number;
  paused: number;
  failed: number;
  total: number;
}

export interface IJourneyWithStats extends IJourney {
  stats: IJourneyStats;
}

// ======================
//  API RESPONSES
// ======================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
  suggestion?: string;
  conflictingJourney?: {
    _id: string;
    name: string;
  };
}

export interface JourneyListResponse {
  success: boolean;
  data: IJourney[];
  count: number;
}

export interface DashboardStats {
  journeys: {
    total: number;
    active: number;
    draft: number;
    inactive: number;
  };
  progresses: {
    active: number;
    completed: number;
    paused: number;
    failed: number;
    total: number;
  };
  scheduledActions: {
    pending: number;
    sent: number;
    failed: number;
    cancelled: number;
    total: number;
  };
  topJourneys: Array<{
    _id: string;
    name: string;
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  }>;
  recentActivity: Array<{
    journey: { name: string };
    lead: { firstName: string; lastName: string; email: string };
    status: string;
    lastActivityAt: string;
  }>;
}

// ======================
//  CREATE/UPDATE PAYLOADS
// ======================
export interface CreateJourneyPayload {
  name: string;
  contactType: ContactType;
  leadIntent: LeadIntent;
  entryAction: IEntryAction;
  nodes?: IJourneyNode[];
  edges?: IJourneyEdge[];
  entryNodeId?: string;
  description?: string;
}

export interface UpdateJourneyPayload {
  name?: string;
  description?: string;
  nodes?: IJourneyNode[];
  edges?: IJourneyEdge[];
  entryNodeId?: string;
  contactType?: ContactType;
  leadIntent?: LeadIntent;
  entryAction?: IEntryAction;
}

// ======================
//  FILTER OPTIONS
// ======================
export interface JourneyFilters {
  status?: "active" | "draft" | "all";
  contactType?: ContactType;
  leadIntent?: LeadIntent;
}
