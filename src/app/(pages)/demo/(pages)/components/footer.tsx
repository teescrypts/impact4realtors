"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#212121", color: "white", py: 6 }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Newsletter Sign-up Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Sign Up for Our Newsletter
            </Typography>
            <Typography variant="body2" mb={2}>
              Get updated on new listings and exclusive offers.
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                variant="outlined"
                placeholder="Your Email"
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "white",
                    borderRadius: 1,
                  },
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" color="secondary">
                Subscribe
              </Button>
            </Stack>
          </Grid>

          {/* Contact Us Section */}
          <Grid item xs={12} md={5}>
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
              <IconButton aria-label="Facebook" sx={{ color: "white" }}>
                F
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: "white" }}>
                T
              </IconButton>
              <IconButton aria-label="Instagram" sx={{ color: "white" }}>
                IG
              </IconButton>
              <IconButton aria-label="LinkedIn" sx={{ color: "white" }}>
                LN
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

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
