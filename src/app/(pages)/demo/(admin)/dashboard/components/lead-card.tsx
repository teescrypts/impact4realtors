import { Card, CardContent, Typography, Checkbox, Stack, Box } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { LeadType } from "../lead/page";

interface LeadCardProps {
  lead: LeadType;
  toggleSelection: (leadId: string) => void;
  isSelected: boolean;
}

export default function LeadCard({
  lead,
  toggleSelection,
  isSelected,
}: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead._id,
    });

  const cardStyle = {
    my: 1,
    cursor: "grab",
    width: "100%",
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: "transform 150ms ease",
    zIndex: isDragging ? 1000 : "auto",
    border: isSelected ? "2px solid green" : "none",
    borderRadius: "8px",
  };

  return (
    <Box sx={{ touchAction: "none" }}>
      <Card ref={setNodeRef} {...attributes} {...listeners} sx={cardStyle}>
        <Checkbox
          checked={isSelected}
          onChange={() => toggleSelection(lead._id)}
        />
        <CardContent>
          <Stack direction={"column"}>
            <Typography variant="subtitle1">
              {lead.firstName} {lead.lastName}
            </Typography>
            <Typography variant="body2">{lead.email}</Typography>
            <Typography variant="body2">{lead.phone}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
