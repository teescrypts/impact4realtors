/**
 * Journey Path Walking
 *
 * Works out the ordered path a lead is on through a journey, and how far along
 * it is. Deliberately free of React and Mongoose so both the API (summarising
 * leads for the list) and the dashboard (drawing the step track) use the same
 * answer - otherwise the table and the drawer disagree about how complete a
 * journey is.
 *
 * Typed structurally rather than against a concrete model so it accepts both
 * the Mongoose documents and the frontend API types.
 */

export type StepState = "done" | "current" | "failed" | "upcoming" | "skipped";

export interface PathNode {
  id: string;
  type: string;
}

export interface PathEdge {
  source: string;
  target: string;
  label?: "yes" | "no";
}

export interface PathJourney {
  entryNodeId?: string;
  nodes: PathNode[];
  edges: PathEdge[];
}

export interface PathRecord {
  nodeId: string;
  status: string;
  result?: { conditionMet?: boolean };
}

export interface PathProgress {
  currentNodeId: string;
  status: string;
  executionHistory?: PathRecord[];
}

export interface PathStep {
  nodeId: string;
  state: StepState;
  /** Which branch was taken out of a condition, where it has already run. */
  branchTaken?: "yes" | "no";
}

/**
 * Walk from the entry node and return the path this lead is on.
 *
 * At a condition, the branch actually taken is read from the execution
 * history; if it has not run yet we follow "yes" so a likely path ahead can
 * still be shown. Visited ids are tracked so a journey that loops back cannot
 * spin forever.
 */
export function walkJourneyPath(
  journey: PathJourney,
  progress: PathProgress,
): PathStep[] {
  const nodes = journey.nodes ?? [];
  const edges = journey.edges ?? [];
  const history = progress.executionHistory ?? [];

  const recordsFor = (nodeId: string) =>
    history.filter((record) => record.nodeId === nodeId);

  const order: string[] = [];
  const branches = new Map<string, "yes" | "no">();
  const seen = new Set<string>();

  let nodeId: string | undefined = journey.entryNodeId ?? nodes[0]?.id;

  while (nodeId && !seen.has(nodeId)) {
    seen.add(nodeId);

    const node = nodes.find((candidate) => candidate.id === nodeId);
    if (!node) break;

    order.push(node.id);

    const outgoing = edges.filter((edge) => edge.source === nodeId);
    if (outgoing.length === 0) break;

    if (outgoing.length === 1) {
      nodeId = outgoing[0].target;
      continue;
    }

    const last = recordsFor(node.id).at(-1);
    const met = last?.result?.conditionMet;
    const label: "yes" | "no" = met === false ? "no" : "yes";

    if (met !== undefined) branches.set(node.id, label);

    nodeId = (outgoing.find((edge) => edge.label === label) ?? outgoing[0])
      .target;
  }

  const currentIndex = order.indexOf(progress.currentNodeId);

  return order.map((id, index) => {
    const last = recordsFor(id).at(-1);
    const isCurrent = id === progress.currentNodeId;

    let state: StepState;

    if (isCurrent && progress.status === "failed") {
      state = "failed";
    } else if (last?.status === "success") {
      state = "done";
    } else if (isCurrent && progress.status === "cancelled") {
      // Stopped here rather than sitting here - nothing is "current" any more.
      state = "skipped";
    } else if (isCurrent) {
      state = "current";
    } else if (currentIndex >= 0 && index < currentIndex) {
      // Behind the pointer with no success recorded - it was stepped over.
      state = last?.status === "failed" ? "failed" : "skipped";
    } else if (currentIndex === -1 && progress.status === "completed") {
      state = "done";
    } else {
      state = "upcoming";
    }

    return { nodeId: id, state, branchTaken: branches.get(id) };
  });
}

export interface ProgressSummary {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

/**
 * How far along a lead is, counting steps on their own path rather than
 * execution-history entries - retries and failures would otherwise inflate it.
 */
export function summariseProgress(
  journey: PathJourney,
  progress: PathProgress,
): ProgressSummary {
  const steps = walkJourneyPath(journey, progress);
  const completedSteps = steps.filter((step) => step.state === "done").length;

  return {
    totalSteps: steps.length,
    completedSteps,
    percentage:
      steps.length > 0
        ? Math.round((completedSteps / steps.length) * 100)
        : 0,
  };
}
