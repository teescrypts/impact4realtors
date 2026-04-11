/**
 * Data Transformers - UPDATED
 *
 * Now using aligned field names between canvas and backend
 * Much simpler transformations!
 */

import { IJourney, IJourneyNode, IJourneyEdge, NodeConfig } from "../types/api";
import {
  Journey as CanvasJourney,
  JourneyNode as CanvasNode,
  NodeData,
  Branch,
  generateBranchId,
  EntryData,
  ConditionData,
  DelayData,
  TriggerData,
  SendEmailData,
  MeetingReminderData,
  SmsReminderData,
  CallReminderData,
} from "../canvas/type";

/**
 * Transform backend journey to canvas format
 */
export function apiToCanvas(apiJourney: IJourney): CanvasJourney {
  const nodesRecord: Record<string, CanvasNode> = {};

  // Convert each backend node to canvas node
  apiJourney.nodes.forEach((apiNode) => {
    nodesRecord[apiNode.id] = {
      id: apiNode.id,
      type: apiNode.type,
      data: configToData(apiNode.config),
      branches: createBranchesFromEdges(
        apiNode.id,
        apiJourney.edges,
        apiNode.type,
      ),
    };
  });

  return {
    id: apiJourney._id,
    name: apiJourney.name,
    description: apiJourney.description,
    entryNodeId: apiJourney.entryNodeId,
    nodes: nodesRecord,
    createdAt: new Date(apiJourney.createdAt),
    updatedAt: new Date(apiJourney.updatedAt),
  };
}

/**
 * Transform canvas journey to backend format
 */
export function canvasToApi(
  canvasJourney: CanvasJourney,
  originalJourney?: IJourney,
): {
  nodes: IJourneyNode[];
  edges: IJourneyEdge[];
  entryNodeId: string;
  name: string;
  description?: string;
} {
  console.log(originalJourney)
  const nodes: IJourneyNode[] = [];
  const edges: IJourneyEdge[] = [];

  // Convert canvas nodes to backend nodes
  Object.values(canvasJourney.nodes).forEach((canvasNode) => {
    // Create backend node
    nodes.push({
      id: canvasNode.id,
      type: canvasNode.type,
      config: dataToConfig(canvasNode.data, canvasNode.type),
      position: undefined,
    });

    // Create edges from branches
    canvasNode.branches.forEach((branch) => {
      if (branch.targetNodeId) {
        edges.push({
          id: branch.id,
          source: canvasNode.id,
          target: branch.targetNodeId,
          label:
            branch.label === "next"
              ? undefined
              : (branch.label as "yes" | "no"),
        });
      }
    });
  });

  return {
    name: canvasJourney.name,
    description: canvasJourney.description,
    nodes,
    edges,
    entryNodeId: canvasJourney.entryNodeId,
  };
}

/**
 * Convert backend NodeConfig to canvas NodeData
 * ✅ UPDATED: Much simpler now with aligned field names!
 */
function configToData(config: NodeConfig): NodeData {
  switch (config.type) {
    case "entry":
      return {
        actionType: "lead_created",
        description: "When entry conditions are met",
      } as EntryData;

    case "condition":
      // ✅ Field names now match!
      return {
        checkType: config.checkType,
        description: config.description,
      } as ConditionData;

    case "delay":
      // ✅ Field names match!
      return {
        duration: config.duration,
        unit: config.unit,
      } as DelayData;

    case "trigger":
      // ✅ Field names match!
      return {
        waitForTag: config.waitForTag,
        description: config.description,
      } as TriggerData;

    case "send_email":
      // ✅ Field names match!
      return {
        subject: config.subject,
        emailContent: config.emailContent,
        fromName: config.fromName,
      } as SendEmailData;

    case "meeting_reminder":
      // ✅ Field names match!
      return {
        title: config.title || "Meeting Reminder",
        message: config.message,
      } as MeetingReminderData;

    case "sms_reminder":
      // ✅ Field names match!
      return {
        message: config.message,
      } as SmsReminderData;

    case "call_reminder":
      // ✅ Field names match!
      return {
        message: config.message,
      } as CallReminderData;

    default:
      throw new Error(`Unknown config type: ${(config as any).type}`);
  }
}

/**
 * Convert canvas NodeData to backend NodeConfig
 * ✅ UPDATED: Much simpler now with aligned field names!
 */
function dataToConfig(data: NodeData, type: string): NodeConfig {
  switch (type) {
    case "entry":
      return { type: "entry" };

    case "condition": {
      const conditionData = data as ConditionData;
      // ✅ Direct mapping!
      return {
        type: "condition",
        checkType: conditionData.checkType,
        description: conditionData.description,
      };
    }

    case "delay": {
      const delayData = data as DelayData;
      // ✅ Direct mapping!
      return {
        type: "delay",
        duration: delayData.duration,
        unit: delayData.unit,
      };
    }

    case "trigger": {
      const triggerData = data as TriggerData;
      // ✅ Direct mapping!
      return {
        type: "trigger",
        waitForTag: triggerData.waitForTag,
        description: triggerData.description,
      };
    }

    case "send_email": {
      const emailData = data as SendEmailData;
      // ✅ Direct mapping!
      return {
        type: "send_email",
        subject: emailData.subject,
        emailContent: emailData.emailContent,
        fromName: emailData.fromName,
      };
    }

    case "meeting_reminder": {
      const meetingData = data as MeetingReminderData;
      // ✅ Direct mapping!
      return {
        type: "meeting_reminder",
        title: meetingData.title,
        message: meetingData.message,
      };
    }

    case "sms_reminder": {
      const smsData = data as SmsReminderData;
      // ✅ Direct mapping!
      return {
        type: "sms_reminder",
        message: smsData.message,
      };
    }

    case "call_reminder": {
      const callData = data as CallReminderData;
      // ✅ Direct mapping!
      return {
        type: "call_reminder",
        message: callData.message,
      };
    }

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

/**
 * Create canvas branches from backend edges
 */
function createBranchesFromEdges(
  nodeId: string,
  edges: IJourneyEdge[],
  nodeType: string,
): Branch[] {
  const outgoingEdges = edges.filter((e) => e.source === nodeId);

  // If no edges, create default empty branch
  if (outgoingEdges.length === 0) {
    if (nodeType === "condition") {
      // Conditions need yes/no branches
      return [
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
      ];
    } else {
      // Other nodes get single "next" branch
      return [
        {
          id: generateBranchId(),
          label: "next",
          targetNodeId: null,
        },
      ];
    }
  }

  // Convert edges to branches
  return outgoingEdges.map((edge) => ({
    id: edge.id,
    label: (edge.label || "next") as Branch["label"],
    targetNodeId: edge.target,
  }));
}

/**
 * Helper: Convert MongoDB _id to frontend id
 */
export function normalizeId(journey: IJourney): IJourney & { id: string } {
  return {
    ...journey,
    id: journey._id,
  };
}

/**
 * Helper: Convert array of journeys
 */
export function normalizeJourneys(
  journeys: IJourney[],
): Array<IJourney & { id: string }> {
  return journeys.map(normalizeId);
}
