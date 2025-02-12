import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Box,
  Stack,
} from "@mui/material";
import { useDraggable } from "@dnd-kit/core"; // Use useDraggable for the lead cards
import { CSS } from "@dnd-kit/utilities";

interface LeadCardProps {
  lead: any;
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
      id: lead.id, // Set the lead's ID to make it unique for dragging
    });

  // Apply transform, transition, and z-index style when dragging
  const cardStyle = {
    my: 1,
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    width: "100%",
    transform: transform ? CSS.Transform.toString(transform) : undefined, // Handle transformation
    transition: isDragging ? "transform 150ms ease" : "none", // Transition when dragging
    zIndex: isDragging ? 1000 : "auto", // Set a higher z-index while dragging
    border: isSelected || isDragging ? "2px solid green" : "none", // Apply green border when selected or dragging
    borderRadius: "8px", // Optional: to round the corners a bit for a clean look
  };

  // Render the card normally when not dragging
  if (!isDragging) {
    return (
      <Card>
        <Checkbox
          checked={isSelected}
          onChange={() => toggleSelection(lead.id)}
          sx={{
            // Remove any size change effect from the checkbox
            "&.Mui-checked": {
              transform: "none", // Prevents any scale or size change on checkbox check
            },
          }}
        />
        <Box sx={{ flex: 1 }}>
          <CardContent
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            sx={cardStyle}
          >
            <Stack direction={"column"}>
              <Typography variant="subtitle1">{lead.name}</Typography>
              <Typography variant="body2">{lead.email}</Typography>
              <Typography variant="body2">{lead.phone}</Typography>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    );
  }

  // For the overlay when dragging
  return (
    <Card>
      <Checkbox
        checked={isSelected}
        onChange={() => toggleSelection(lead.id)}
      />
      <Box sx={{ flex: 1 }}>
        <CardContent
          sx={{
            position: "fixed",
            transform: transform
              ? CSS.Transform.toString(transform)
              : undefined, // Ensure it follows the correct transform
            zIndex: 1000, // Ensure it floats above other content
            cursor: "grabbing",
            pointerEvents: "none", // This prevents any interaction while dragging
            border: "2px solid green", // Add a green border while dragging
            borderRadius: "8px", // Optional: consistent border radius
          }}
        >
          <Stack direction={"column"}>
            <Typography variant="subtitle1">{lead.name}</Typography>
            <Typography variant="body2">{lead.email}</Typography>
            <Typography variant="body2">{lead.phone}</Typography>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
