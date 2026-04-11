"use client";

import { AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useJourneyStore } from "./journey-store";
import { NodeTree } from "./node-tree";
import { EditPanel } from "./edit-panel";
import { IJourney } from "../types/api";
import { ITag } from "../../tag/types/tag";

const SIDE_NAV_WIDTH = 280;

interface JourneyCanvasProps {
  journey?: IJourney;
  tags: ITag[]; // ✅ Add tags prop
  tagsLoading?: boolean; // ✅ Add loading state
}

export function JourneyCanvas({ journey, tags, tagsLoading = false }: JourneyCanvasProps) {
  const theme = useTheme();
  
  // Get everything from store (canvas structure with "data")
  const { 
    journey: canvasJourney,
    selectedNodeId, 
    closeEditPanel, 
    isEditPanelOpen 
  } = useJourneyStore();

  // Get node from canvas store (has "data" property)
  const selectedNode = selectedNodeId
    ? canvasJourney.nodes[selectedNodeId] ?? null
    : null;

  // ✅ Filter tags by journey's contactType
  const relevantTags = journey 
    ? tags.filter(tag => tag.category === journey.contactType)
    : tags;

  return (
    <Box position="relative" flex={1} height="100vh">
      {/* Scrollable canvas wrapper */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        overflow="auto"
        sx={{
          paddingLeft: { lg: `${SIDE_NAV_WIDTH}px` },
        }}
      >
        {/* Inner canvas with centered content */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          minWidth="100%"
          minHeight="100%"
          p={4}
          sx={{
            backgroundImage: `radial-gradient(${alpha(
              theme.palette.divider,
              0.4,
            )} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* Content container */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            pt={4}
            pb={10}
          >
            {/* Journey root node - ✅ Pass tags down */}
            <NodeTree 
              nodeId={canvasJourney.entryNodeId} 
              tags={relevantTags}
              tagsLoading={tagsLoading}
            />
          </Box>
        </Box>
      </Box>

      {/* Edit panel overlay */}
      <AnimatePresence>
        {isEditPanelOpen && selectedNode && (
          <>
            {/* Backdrop */}
            <Box
              onClick={closeEditPanel}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                bgcolor: alpha(theme.palette.common.black, 0.2),
              }}
            />

            {/* Edit Panel - ✅ Pass tags */}
            <EditPanel 
              node={selectedNode} 
              onClose={closeEditPanel}
              tags={relevantTags}
              tagsLoading={tagsLoading}
            />
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}
