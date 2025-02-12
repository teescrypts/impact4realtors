"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CustomTheme from "./custom-theme";

const ErrorUi = ({ reset }: { reset: () => void }) => {
  return (
    <>
      <CustomTheme colorPreset="purple">
        <Box
          component="main"
          sx={{
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            py: "80px",
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 6,
              }}
            >
              <Box
                alt="Internal server error"
                component="img"
                src="/assets/errors/error-500.png"
                sx={{
                  height: "auto",
                  maxWidth: "100%",
                  width: 400,
                }}
              />
            </Box>
            <Typography align="center" variant={"h2"}></Typography>
            <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
              Click The Button Below To Refresh
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 6,
              }}
            >
              <Button onClick={() => reset()}>Refresh</Button>
            </Box>
          </Container>
        </Box>
      </CustomTheme>
    </>
  );
};

export default ErrorUi;
