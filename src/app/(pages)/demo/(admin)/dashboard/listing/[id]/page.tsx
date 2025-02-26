import apiRequest from "@/app/lib/api-request";
import { PropertyType } from "@/types";
import { cookies } from "next/headers";
import React from "react";
import { DraftImgType } from "../add/page";
import { RouterLink } from "@/app/component/router-link";
import {
  Box,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import EditListingPage from "../../components/edit-listing-page";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    messaage: string;
    data: { property: PropertyType; draftImages: DraftImgType[] };
  }>(`admin/listing/${id}`, {
    token,
    tag: "fetchAdminProperty",
  });

  const property = response.data.property;
  const draftImages = response.data.draftImages;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Add New Listing
        </Typography>

        <Stack sx={{ mb: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              component={RouterLink}
              href={"/demo/dashboard/listing"}
            >
              Listing
            </Link>
            <Typography color="text.primary"> Edit Listed Property</Typography>
          </Breadcrumbs>
        </Stack>

        <EditListingPage property={property} draftImages={draftImages} />
      </Container>
    </Box>
  );
}

export default Page;
