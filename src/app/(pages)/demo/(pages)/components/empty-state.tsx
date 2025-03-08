import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description = "Try adding new items or check back later.",
  actionText,
  onAction,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100%"
      minHeight="300px"
      sx={{ opacity: 0.9 }}
    >
      {/* Illustration */}
      <Image
        src="/images/empty-folder.png" // Ensure you have this image in /public folder
        alt="Empty State"
        width={250}
        height={200}
        priority
        style={{ marginBottom: 16 }}
      />

      {/* Title */}
      <Typography variant="h5" fontWeight="bold" color="text.primary">
        {title}
      </Typography>

      {/* Description */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        {description}
      </Typography>

      {/* Optional Action Button */}
      {actionText && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
