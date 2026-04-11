import { create } from "zustand";
import {
  Branch,
  createCallReminderNode,
  createConditionNode,
  createDelayNode,
  createEntryNode,
  createMeetingReminderNode,
  createSendEmailNode,
  createSmsReminderNode,
  createTriggerNode,
  Journey,
  JourneyNode,
  NodeType,
} from "./type";

interface JourneyState {
  journey: Journey;
  selectedNodeId: string | null;
  isEditPanelOpen: boolean;

  // Actions
  selectNode: (nodeId: string | null) => void;
  openEditPanel: () => void;
  closeEditPanel: () => void;

  // Node operations - ✅ UPDATED: Now accepts initial data
  addNode: (
    parentNodeId: string,
    branchLabel: Branch["label"],
    nodeType: Exclude<NodeType, "entry">,
    initialData?: any, // ✅ NEW: Optional initial data from config dialog
  ) => void;
  updateNode: (nodeId: string, updates: Partial<JourneyNode>) => void;
  deleteNode: (nodeId: string) => void;

  // Journey operations
  resetJourney: () => void;
  loadJourney: (journey: Journey) => void;
  updateJourneyInfo: (updates: { name?: string; description?: string }) => void;
}

function createInitialJourney(): Journey {
  const entryNode = createEntryNode();

  return {
    id: "journey_1",
    name: "New Lead Follow-up",
    description: "Automated follow-up sequence for new leads",
    entryNodeId: entryNode.id,
    nodes: {
      [entryNode.id]: entryNode,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  journey: createInitialJourney(),
  selectedNodeId: null,
  isEditPanelOpen: false,

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId, isEditPanelOpen: nodeId !== null });
  },

  openEditPanel: () => {
    set({ isEditPanelOpen: true });
  },

  closeEditPanel: () => {
    set({ isEditPanelOpen: false, selectedNodeId: null });
  },

  // ✅ UPDATED: Can accept initial data
  addNode: (parentNodeId, branchLabel, nodeType, initialData) => {
    const { journey } = get();
    const parentNode = journey.nodes[parentNodeId];

    if (!parentNode) return;

    // Create the new node
    let newNode: JourneyNode;
    switch (nodeType) {
      case "condition":
        newNode = createConditionNode();
        break;
      case "delay":
        newNode = createDelayNode();
        break;
      case "trigger":
        newNode = createTriggerNode();
        break;
      case "send_email":
        newNode = createSendEmailNode();
        break;
      case "meeting_reminder":
        newNode = createMeetingReminderNode();
        break;
      case "sms_reminder":
        newNode = createSmsReminderNode();
        break;
      case "call_reminder":
        newNode = createCallReminderNode();
        break;
      default:
        return;
    }

    // ✅ NEW: Apply initial data if provided
    if (initialData) {
      newNode = {
        ...newNode,
        data: {
          ...newNode.data,
          ...initialData,
        },
      };
    }

    // Update parent's branch to point to new node
    const updatedParentBranches = parentNode.branches.map((branch) =>
      branch.label === branchLabel
        ? { ...branch, targetNodeId: newNode.id }
        : branch,
    );

    set({
      journey: {
        ...journey,
        nodes: {
          ...journey.nodes,
          [parentNodeId]: {
            ...parentNode,
            branches: updatedParentBranches,
          },
          [newNode.id]: newNode,
        },
        updatedAt: new Date(),
      },
    });
  },

  updateNode: (nodeId, updates) => {
    const { journey } = get();
    const node = journey.nodes[nodeId];

    if (!node) return;

    set({
      journey: {
        ...journey,
        nodes: {
          ...journey.nodes,
          [nodeId]: {
            ...node,
            ...updates,
            data: updates.data ? { ...node.data, ...updates.data } : node.data,
          },
        },
        updatedAt: new Date(),
      },
    });
  },

  deleteNode: (nodeId) => {
    const { journey, selectedNodeId } = get();

    // Can't delete entry node
    if (nodeId === journey.entryNodeId) return;

    const nodeToDelete = journey.nodes[nodeId];
    if (!nodeToDelete) return;

    // Find parent node and update its branch
    const updatedNodes = { ...journey.nodes };

    for (const [id, node] of Object.entries(updatedNodes)) {
      const branchPointingToDeleted = node.branches.find(
        (b) => b.targetNodeId === nodeId,
      );

      if (branchPointingToDeleted) {
        // Get the first child of the deleted node (if any)
        const deletedNodeFirstChild = nodeToDelete.branches[0]?.targetNodeId;

        updatedNodes[id] = {
          ...node,
          branches: node.branches.map((branch) =>
            branch.targetNodeId === nodeId
              ? { ...branch, targetNodeId: deletedNodeFirstChild }
              : branch,
          ),
        };
      }
    }

    // Remove the node
    delete updatedNodes[nodeId];

    set({
      journey: {
        ...journey,
        nodes: updatedNodes,
        updatedAt: new Date(),
      },
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      isEditPanelOpen:
        selectedNodeId === nodeId ? false : get().isEditPanelOpen,
    });
  },

  resetJourney: () => {
    set({
      journey: createInitialJourney(),
      selectedNodeId: null,
      isEditPanelOpen: false,
    });
  },

  /**
   * Load a journey from API (after transformation via apiToCanvas)
   */
  loadJourney: (journey: Journey) => {
    console.log("Loading journey into store:", journey);
    set({
      journey: {
        ...journey,
        updatedAt: new Date(),
      },
      selectedNodeId: null,
      isEditPanelOpen: false,
    });
  },

  /**
   * Update journey metadata (name, description)
   */
  updateJourneyInfo: (updates: { name?: string; description?: string }) => {
    const { journey } = get();
    set({
      journey: {
        ...journey,
        ...updates,
        updatedAt: new Date(),
      },
    });
  },
}));
