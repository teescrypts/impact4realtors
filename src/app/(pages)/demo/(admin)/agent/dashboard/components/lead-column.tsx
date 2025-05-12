import { Paper, Typography, Box, Grid2 } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import LeadCard from "./lead-card";
import { LeadType } from "../lead/page";

interface LeadColumnProps {
  category: string;
  stage: string;
  leads: LeadType[];
  toggleSelection: (leadId: string) => void;
  selectedLeads: string[];
}

export default function LeadColumn({
  category,
  stage,
  leads,
  toggleSelection,
  selectedLeads,
}: LeadColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <Grid2 sx={{ flex: "0 0 auto", textAlign: "center" }}>
      <Paper ref={setNodeRef} sx={{ minWidth: 300, p: 2 }}>
        <Typography variant="h6">{stage}</Typography>
        <Box sx={{ overflowY: "auto", maxHeight: "80vh" }}>
          {leads
            .filter((lead) => {
              return (
                lead.status.toLowerCase() === stage.toLowerCase() &&
                lead.type.toLowerCase() === category.toLowerCase()
              );
            })
            .map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                toggleSelection={toggleSelection}
                isSelected={selectedLeads.includes(lead._id)}
              />
            ))}
        </Box>
      </Paper>
    </Grid2>
  );
}
