"use client";

import React from "react";
import { Modal, Box, Typography, IconButton, Divider } from "@mui/material";
import Close from "../icons/untitled-ui/duocolor/close";

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode; // For footer actions like buttons
  maxWidth?: number | string; // Optional max-width for content
}

const ModalBox: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "600px",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          width: "90%", // Ensures it adapts on small screens
          maxWidth, // Respects maxWidth for larger screens
          minWidth: 300, // Ensures it does not shrink below a minimum
          maxHeight: "80vh", // Restricts height for scrollability
          overflowY: "auto", // Enables vertical scrolling if content overflows
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title and Close Button */}
        {title && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 600 }}
            >
              {title}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Divider between title and content */}
        {title && <Divider sx={{ mb: 2 }} />}

        {/* Modal Content */}
        <Box id="modal-description" sx={{ mb: actions ? 2 : 0 }}>
          {children}
        </Box>

        {/* Optional Footer Actions */}
        {actions && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalBox;
