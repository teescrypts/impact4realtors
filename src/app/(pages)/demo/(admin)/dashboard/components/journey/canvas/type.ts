import { createBlock, EmailBlock } from "@/app/lib/email/blocks";

export type NodeType =
  | "entry"
  | "condition"
  | "delay"
  | "trigger"
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder";

export type RuleNodeType = "condition" | "delay" | "trigger";
export type ActionNodeType =
  | "send_email"
  | "meeting_reminder"
  | "sms_reminder"
  | "call_reminder";

export type DelayUnit = "minutes" | "hours" | "days";

// ✅ UPDATED: Removed tag-related condition types
// Condition only checks email engagement now
export type ConditionCheckType = "email_opened";

// Node Data Types - Aligned with Backend NodeConfig
export interface EntryData {
  actionType: "lead_created" | "form_submitted" | "manual_add";
  description?: string;
}

// ✅ UPDATED: Simplified condition to only check email
export interface ConditionData {
  checkType: ConditionCheckType; // Changed from conditionType
  description?: string;
  /** How long to wait for an open before taking the "No" path. */
  waitFor?: {
    duration: number;
    unit: DelayUnit;
  };
}

export interface WaitWindow {
  duration: number;
  unit: DelayUnit;
}

/** Applied when a condition node has no wait window saved. */
export const DEFAULT_CONDITION_WAIT: WaitWindow = {
  duration: 2,
  unit: "days",
};

/**
 * The choices offered for "how long do we wait for an open".
 *
 * Deliberately a fixed list rather than a free-text number: the wait is
 * implemented as a scheduled email, and Resend will not schedule further than
 * 30 days out. Nothing here can exceed that.
 */
export const WAIT_OPTIONS: { label: string; value: WaitWindow }[] = [
  { label: "1 hour", value: { duration: 1, unit: "hours" } },
  { label: "3 hours", value: { duration: 3, unit: "hours" } },
  { label: "6 hours", value: { duration: 6, unit: "hours" } },
  { label: "12 hours", value: { duration: 12, unit: "hours" } },
  { label: "1 day", value: { duration: 1, unit: "days" } },
  { label: "2 days", value: { duration: 2, unit: "days" } },
  { label: "3 days", value: { duration: 3, unit: "days" } },
  { label: "5 days", value: { duration: 5, unit: "days" } },
  { label: "1 week", value: { duration: 7, unit: "days" } },
  { label: "2 weeks", value: { duration: 14, unit: "days" } },
  { label: "3 weeks", value: { duration: 21, unit: "days" } },
  { label: "30 days", value: { duration: 30, unit: "days" } },
];

/** Total minutes for a wait window — used to compare windows written different ways. */
export function waitToMinutes(wait: WaitWindow): number {
  switch (wait.unit) {
    case "minutes":
      return wait.duration;
    case "hours":
      return wait.duration * 60;
    case "days":
      return wait.duration * 60 * 24;
  }
}

/**
 * Human label for a wait window. Matches on elapsed time, so a window saved
 * as "48 hours" still reads as "2 days".
 */
export function formatWait(wait: WaitWindow): string {
  const minutes = waitToMinutes(wait);
  const preset = WAIT_OPTIONS.find(
    (option) => waitToMinutes(option.value) === minutes,
  );

  return preset ? preset.label : `${wait.duration} ${wait.unit}`;
}

export interface DelayData {
  duration: number;
  unit: DelayUnit;
}

// ✅ UPDATED: Aligned with backend
export interface TriggerData {
  waitForTag: string; // Changed from tagName
  description?: string;
}

// ✅ UPDATED: Aligned with backend field names
export interface SendEmailData {
  subject: string;
  emailContent: string; // Changed from body
  /** Structured content. When present, emailContent is regenerated from it. */
  emailBlocks?: EmailBlock[];
  fromName?: string;
}

// ✅ UPDATED: Aligned with backend
export interface MeetingReminderData {
  title: string;
  message: string; // Changed from notes
}

// ✅ UPDATED: Aligned with backend
export interface SmsReminderData {
  message: string;
}

// ✅ UPDATED: Aligned with backend
export interface CallReminderData {
  message: string; // Changed from notes
}

export type NodeData =
  | EntryData
  | ConditionData
  | DelayData
  | TriggerData
  | SendEmailData
  | MeetingReminderData
  | SmsReminderData
  | CallReminderData;

// Branch represents a path from a node
export interface Branch {
  id: string;
  label: "yes" | "no" | "next";
  targetNodeId: string | null;
}

// Journey Node
export interface JourneyNode {
  id: string;
  type: NodeType;
  data: NodeData;
  branches: Branch[];
}

// The complete journey
export interface Journey {
  id: string;
  name: string;
  description?: string;
  entryNodeId: string;
  nodes: Record<string, JourneyNode>;
  createdAt: Date;
  updatedAt: Date;
}

// Helper type guards
export function isEntryData(data: NodeData): data is EntryData {
  return "actionType" in data;
}

export function isConditionData(data: NodeData): data is ConditionData {
  return "checkType" in data;
}

export function isDelayData(data: NodeData): data is DelayData {
  return "duration" in data && "unit" in data;
}

export function isTriggerData(data: NodeData): data is TriggerData {
  return "waitForTag" in data;
}

export function isSendEmailData(data: NodeData): data is SendEmailData {
  return "subject" in data && "emailContent" in data;
}

export function isMeetingReminderData(
  data: NodeData,
): data is MeetingReminderData {
  return "title" in data && "message" in data && !("subject" in data);
}

export function isSmsReminderData(data: NodeData): data is SmsReminderData {
  return "message" in data && !("title" in data);
}

export function isCallReminderData(data: NodeData): data is CallReminderData {
  return "message" in data && !("title" in data) && !("subject" in data);
}

// Utility functions
export function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBranchId(): string {
  return `branch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createEntryNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "entry",
    data: {
      actionType: "lead_created",
      description: "When a new lead is created",
    } as EntryData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createConditionNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "condition",
    data: {
      checkType: "email_opened",
      description: "Did they open the previous email?",
      waitFor: { ...DEFAULT_CONDITION_WAIT },
    } as ConditionData,
    branches: [
      {
        id: generateBranchId(),
        label: "yes",
        targetNodeId: null,
      },
      {
        id: generateBranchId(),
        label: "no",
        targetNodeId: null,
      },
    ],
  };
}

export function createDelayNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "delay",
    data: {
      duration: 1,
      unit: "days",
    } as DelayData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createTriggerNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "trigger",
    data: {
      waitForTag: "", // User must configure
      description: "Wait for specific tag to be assigned",
    } as TriggerData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createSendEmailNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "send_email",
    data: {
      subject: "",
      emailContent: "",
      // New emails start as blocks so the agent never meets raw HTML.
      emailBlocks: [
        createBlock("heading"),
        createBlock("paragraph"),
      ],
      fromName: "",
    } as SendEmailData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createMeetingReminderNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "meeting_reminder",
    data: {
      title: "Schedule a meeting",
      message: "",
    } as MeetingReminderData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createSmsReminderNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "sms_reminder",
    data: {
      message: "",
    } as SmsReminderData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

export function createCallReminderNode(): JourneyNode {
  return {
    id: generateNodeId(),
    type: "call_reminder",
    data: {
      message: "",
    } as CallReminderData,
    branches: [
      {
        id: generateBranchId(),
        label: "next",
        targetNodeId: null,
      },
    ],
  };
}

// ✅ UPDATED: Display helpers
export const conditionCheckLabels: Record<ConditionCheckType, string> = {
  email_opened: "Email was opened",
};

export const delayUnitLabels: Record<DelayUnit, string> = {
  minutes: "minute(s)",
  hours: "hour(s)",
  days: "day(s)",
};

export const entryActionLabels: Record<EntryData["actionType"], string> = {
  lead_created: "Lead Created",
  form_submitted: "Form Submitted",
  manual_add: "Manually Added",
};

export const actionNodeLabels: Record<ActionNodeType, string> = {
  send_email: "Send Email",
  meeting_reminder: "Meeting Reminder",
  sms_reminder: "SMS Reminder",
  call_reminder: "Call Reminder",
};
