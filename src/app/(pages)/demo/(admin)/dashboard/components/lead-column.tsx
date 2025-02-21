import { Paper, Typography, Box, Grid2 } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import LeadCard from "./lead-card";

interface LeadColumnProps {
  stage: string;
  leads: any[];
  toggleSelection: (leadId: string) => void;
  selectedLeads: string[];
}

export default function LeadColumn({
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
            .filter((lead) => lead.stage === stage)
            .map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                toggleSelection={toggleSelection}
                isSelected={selectedLeads.includes(lead.id)}
              />
            ))}
        </Box>
      </Paper>
    </Grid2>
  );
}
