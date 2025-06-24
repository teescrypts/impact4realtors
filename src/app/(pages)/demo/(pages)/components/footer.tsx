"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid2,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import Twitter from "@/app/icons/untitled-ui/duocolor/twitter";
import Instagram from "@/app/icons/untitled-ui/duocolor/instaagram";
import Linkedin from "@/app/icons/untitled-ui/duocolor/linkedin";
import Whatsapp from "@/app/icons/untitled-ui/duocolor/whatsapp";
import { addNewsLetter } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";
import { ActionStateType } from "@/types";
import { SubmitButton } from "@/app/component/submit-buttton";

const initialState: ActionStateType = null;

const Footer = () => {
  const [state, formAction] = useActionState(addNewsLetter, initialState);
  const [message, setMessage] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (state) {
      if (state?.error) setMessage(state.error);
      if (state?.message) {
        notify(state.message);
      }
    }
  }, [state]);

  return (
    <Box
      component="footer"
      sx={{ bgcolor: theme.palette.primary.main, color: "white", py: 6 }}
    >
      <Container maxWidth="lg">
        <Grid2
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Newsletter Sign-up Section */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Sign Up for Our Newsletter
            </Typography>
            <Typography variant="body2" mb={2}>
              Get updated on new listings and exclusive offers.
            </Typography>
            {message && (
              <Typography variant="subtitle2" color="error">
                {message}
              </Typography>
            )}
            <form action={formAction}>
              <Stack direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  placeholder="Your Email"
                  size="small"
                  name="email"
                  fullWidth
                  slotProps={{
                    input: {
                      sx: {
                        backgroundColor: "white",
                        borderRadius: 1,
                      },
                    },
                  }}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "white",
                    borderRadius: 1,
                  }}
                />
                <SubmitButton title="Sunscribe" isFullWidth={false} />
              </Stack>
            </form>
          </Grid2>

          {/* Contact Us Section */}
          <Grid2 size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> (123) 456-7890
            </Typography>
            <Typography variant="body2" mb={2}>
              <strong>Email:</strong> info@realtordemo.com
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="Whatsapp" sx={{ color: "white" }}>
                <Whatsapp />
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: "white" }}>
                <Twitter />
              </IconButton>
              <IconButton aria-label="Instagram" sx={{ color: "white" }}>
                <Instagram />
              </IconButton>
              <IconButton aria-label="LinkedIn" sx={{ color: "white" }}>
                <Linkedin />
              </IconButton>
            </Stack>
          </Grid2>
        </Grid2>

        {/* Footer Copyright */}
        <Box textAlign="center" mt={4}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} RealtorDemo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
