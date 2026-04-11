// LeadCaptureModal.tsx
import { useActionState, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,

  Modal,
  Paper,

  IconButton,

} from "@mui/material";
import Close from "@/app/icons/untitled-ui/duocolor/close";
import CheckCircle from "@/app/icons/untitled-ui/duocolor/checked-circle";
import { SubmitButton } from "@/app/component/submit-buttton";
import { ActionStateType } from "@/types";
import { sendBuyerPdf } from "@/app/actions/server-actions";

interface LeadCaptureModalProps {
  adminId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  buyerType: string;
}

const initialState: ActionStateType = null;

export const LeadCaptureModal = ({
  adminId,
  isOpen,
  onClose,
  buyerType,
}: LeadCaptureModalProps) => {
  // const [email, setEmail] = useState("");
  // const [name, setName] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [state, formAction] = useActionState(sendBuyerPdf, initialState);

  useEffect(() => {
    if (state) {
      if (state.message) {
        console.log(state);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }
  }, [state, onClose]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          p: { xs: 3, md: 6 },
          width: { xs: 300, md: 400 },
          borderRadius: 3,
          outline: "none",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>

        {isSuccess ? (
          <Box textAlign="center" py={4}>
            <Box
              sx={{
                mb: 2,
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "primary.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <CheckCircle />
            </Box>
            <Typography variant="h5" fontWeight={600} mb={1}>
              You&apos;re All Set!
            </Typography>
            <Typography color="text.secondary">
              Check your inbox for your free guide.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle2" color="primary" mb={1}>
              {buyerType} Guide
            </Typography>
            <Typography variant="h5" fontWeight={600} mb={2}>
              Get Your Free Guide
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Enter your details below and we&apos;ll send the guide straight to your
              inbox.
            </Typography>

            <form action={formAction}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="First Name"
                  type="text"
                  name="firstName"
                  required
                  fullWidth
                />
                <input name="buyerType" defaultValue={buyerType} hidden />
                <input name="admin" defaultValue={adminId} hidden />
                <TextField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  required
                  fullWidth
                />
                <TextField
                  label="Email Address"
                  type="email"
                  name="email"
                  required
                  fullWidth
                />
                <TextField
                  label="Phone number"
                  type="tel"
                  name="phone"
                  required
                  fullWidth
                />
                <SubmitButton title={"Send My Free Guide"} isFullWidth={true} />
              </Box>
            </form>
          </>
        )}
      </Paper>
    </Modal>
  );
};
