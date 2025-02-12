import React from "react";
import LeadManagement from "../components/lead-management";
import { Box, Container, Stack, Typography } from "@mui/material";

function Page() {
  return (
    <div>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={"xl"}>
          <Stack spacing={2}>
            <Stack sx={{ mb: 2 }}>
              <Typography variant="h4">Lead Management</Typography>
            </Stack>
            <LeadManagement />
          </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default Page;
