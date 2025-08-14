import { RouterLink } from "@/app/component/router-link";
import apiRequest from "@/app/lib/api-request";
import { AppointmentResponse } from "@/types";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import AptDetails from "../../../components/apt-details";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const aptData = await apiRequest<{
    data: AppointmentResponse;
  }>(`admin/appointment/${id}`, {
    token,
    tag: "fetchAdminSingleApt",
  });

  const apt = aptData.data;

  return {
    title: `${apt.customer.firstName} ${apt.customer.lastName} Appointment | Realtor Demo Blog`,
    description: `Appointment Details for ${apt.customer.firstName} ${apt.customer.lastName}`,
    keywords:
      "real estate, trends, realtor demo, independent realtor, blog, real estate technology, property trends",
    icons: {
      icon: "/images/logo.png",
      apple: "/apple-touch-icon.png",
    },
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const response = await apiRequest<{
    data: AppointmentResponse;
  }>(`admin/appointment/${id}`, {
    token,
    tag: "fetchAdminSingleApt",
  });

  const appt = response.data;

  return (
    <div>
      {" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <div>
                <Typography variant="h4">Appointment Details</Typography>
                <Stack sx={{ mb: 2 }}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      underline="hover"
                      color="inherit"
                      sx={{ cursor: "pointer" }}
                      component={RouterLink}
                      href={"/demo/dashboard/appointment?view=calendar"}
                    >
                      Appointments
                    </Link>
                    <Typography color="text.primary">Details</Typography>
                  </Breadcrumbs>
                </Stack>
              </div>
            </Stack>
            <AptDetails appt={appt} />
          </Stack>
        </Container>
      </Box>
    </div>
  );
}

export default Page;
