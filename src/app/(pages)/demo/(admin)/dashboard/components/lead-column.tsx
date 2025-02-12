import { Paper, Typography, Grid2 } from "@mui/material";
import { useDroppable } from "@dnd-kit/core"; // useDroppable for defining drop zones
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
    id: stage, // Use the stage ID as the droppable area identifier
  });

  return (
    <Grid2 size={{xs:12, sm:6, md:4,lg:3}} >
      <Paper ref={setNodeRef} sx={{ p: 2, minHeight: 300, overflowY: "auto" }}>
        <Typography variant="h6">{stage}</Typography>
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
      </Paper>
    </Grid2>
  );
}
