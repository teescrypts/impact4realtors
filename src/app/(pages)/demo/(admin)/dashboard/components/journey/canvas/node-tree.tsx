import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Branch, NodeType } from "./type";
import { useJourneyStore } from "./journey-store";
import { ConnectionLine } from "./connection-line";
import { JourneyNodeCard } from "./journey-node-card";
import { AddStepButton } from "./add-step-button";
import { NodeConfigDialog } from "./node-config-dialog";
import { BranchConnector } from "./branch-connector";
import { ITag } from "../../tag/types/tag";

interface NodeTreeProps {
  nodeId: string;
  branchLabel?: Branch["label"];
  tags: ITag[]; // ✅ Add tags prop
  tagsLoading?: boolean; // ✅ Add loading state
}

export function NodeTree({ nodeId, branchLabel, tags, tagsLoading = false }: NodeTreeProps) {
  const theme = useTheme();
  const { journey, selectedNodeId, selectNode, addNode } = useJourneyStore();

  // State for configuration dialog
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [pendingNodeType, setPendingNodeType] = useState<Exclude<NodeType, "entry"> | null>(null);
  const [pendingBranch, setPendingBranch] = useState<Branch | null>(null);

  const node = journey.nodes[nodeId];
  if (!node) return null;

  // ✅ NEW: Open configuration dialog instead of immediately adding node
  const handleAddNodeClick = (branch: Branch) => (nodeType: Exclude<NodeType, "entry">) => {
    // Condition nodes don't need configuration
    if (nodeType === "condition") {
      addNode(nodeId, branch.label, nodeType);
      return;
    }

    // Other nodes need configuration
    setPendingNodeType(nodeType);
    setPendingBranch(branch);
    setIsConfigDialogOpen(true);
  };

  // ✅ NEW: Handle configuration confirmation
  const handleConfigConfirm = (data: any) => {
    if (!pendingNodeType || !pendingBranch) return;

    // Add node with configured data
    addNode(nodeId, pendingBranch.label, pendingNodeType, data);

    // Reset state
    setIsConfigDialogOpen(false);
    setPendingNodeType(null);
    setPendingBranch(null);
  };

  // ✅ NEW: Handle dialog close
  const handleConfigClose = () => {
    setIsConfigDialogOpen(false);
    setPendingNodeType(null);
    setPendingBranch(null);
  };

  const isConditionNode = node.type === "condition";
  const yesBranch = node.branches.find((b) => b.label === "yes");
  const noBranch = node.branches.find((b) => b.label === "no");
  const nextBranch = node.branches.find((b) => b.label === "next");

  return (
    <>
      <Stack alignItems="center">
        {/* Branch label */}
        {branchLabel && branchLabel !== "next" && (
          <Typography
            variant="caption"
            sx={{
              mb: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: theme.shape.borderRadius,
              fontWeight: 600,
              textTransform: "uppercase",
              bgcolor:
                branchLabel === "yes"
                  ? theme.palette.success.light
                  : theme.palette.error.light,
              color:
                branchLabel === "yes"
                  ? theme.palette.success.dark
                  : theme.palette.error.dark,
            }}
          >
            {branchLabel}
          </Typography>
        )}

        {branchLabel && <ConnectionLine />}

        {/* Node card */}
        <JourneyNodeCard
          node={node}
          isSelected={selectedNodeId === nodeId}
          onClick={() => selectNode(nodeId)}
        />

        {/* Condition branching */}
        {isConditionNode && yesBranch && noBranch && (
          <Box sx={{ mt: 4, width: "100%" }}>
            {/* Connector */}
            <Box sx={{ position: "relative", height: 48 }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: 2,
                  height: 24,
                  bgcolor: theme.palette.divider,
                  transform: "translateX(-50%)",
                }}
              />

              <BranchConnector />
            </Box>

            {/* Two branches */}
            <Stack direction="row" spacing={8} justifyContent="center">
              {/* YES branch */}
              <Box>
                {yesBranch.targetNodeId ? (
                  <NodeTree 
                    nodeId={yesBranch.targetNodeId} 
                    branchLabel="yes" 
                    tags={tags}
                    tagsLoading={tagsLoading}
                  />
                ) : (
                  <Stack alignItems="center" spacing={2}>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: theme.shape.borderRadius,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        bgcolor: theme.palette.success.light,
                        color: theme.palette.success.dark,
                      }}
                    >
                      YES
                    </Typography>
                    <ConnectionLine />
                    <AddStepButton onAddNode={handleAddNodeClick(yesBranch)} />
                  </Stack>
                )}
              </Box>

              {/* NO branch */}
              <Box>
                {noBranch.targetNodeId ? (
                  <NodeTree 
                    nodeId={noBranch.targetNodeId} 
                    branchLabel="no" 
                    tags={tags}
                    tagsLoading={tagsLoading}
                  />
                ) : (
                  <Stack alignItems="center" spacing={2}>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: theme.shape.borderRadius,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        bgcolor: theme.palette.error.light,
                        color: theme.palette.error.dark,
                      }}
                    >
                      NO
                    </Typography>
                    <ConnectionLine />
                    <AddStepButton onAddNode={handleAddNodeClick(noBranch)} />
                  </Stack>
                )}
              </Box>
            </Stack>
          </Box>
        )}

        {/* Normal next branch */}
        {!isConditionNode && nextBranch && (
          <Box sx={{ mt: 4 }}>
            {nextBranch.targetNodeId ? (
              <>
                <ConnectionLine />
                <NodeTree 
                  nodeId={nextBranch.targetNodeId} 
                  tags={tags}
                  tagsLoading={tagsLoading}
                />
              </>
            ) : (
              <Stack alignItems="center" spacing={2}>
                <ConnectionLine />
                <AddStepButton onAddNode={handleAddNodeClick(nextBranch)} />
              </Stack>
            )}
          </Box>
        )}
      </Stack>

      {/* ✅ Configuration Dialog with tags */}
      <NodeConfigDialog
        isOpen={isConfigDialogOpen}
        nodeType={pendingNodeType}
        onClose={handleConfigClose}
        onConfirm={handleConfigConfirm}
        tags={tags}
        tagsLoading={tagsLoading}
      />
    </>
  );
}
