import React from "react";
import ConnectRequestsTabs from "../components/request";
import { Box, Container, Typography } from "@mui/material";
import { cookies } from "next/headers";
import apiRequest from "@/app/lib/api-request";

export interface ConnectType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  connectedAgent: string | null;
  zipCode: string;
  createdAt: Date;
}

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const tokenObj = cookieStore.get("session-token");
  const token = tokenObj?.value;

  const lastCreatedAtQuery = (await searchParams)?.lastCreatedAt || "";
  const status = (await searchParams)?.status;

  const url = status
    ? `admin/connect?status=${status}&lastCreatedAt=${lastCreatedAtQuery}`
    : `admin/connect?status=${"pending"}&lastCreatedAt=${lastCreatedAtQuery}`;

  const response = await apiRequest<{
    data: { connects: ConnectType[]; hasMore: boolean; lastCreatedAt: string };
  }>(url, { token, tag: "fetchAdminConnect" });

  const connects = response.data.connects;
  const hasMore = response.data.hasMore;
  const lastCreatedAt = response.data.lastCreatedAt;

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={"xl"}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          Seller Requests
        </Typography>
        <ConnectRequestsTabs
          connects={connects}
          hasMore={hasMore}
          lastCreatedAt={lastCreatedAt}
        />
      </Container>
    </Box>
  );
}

export default Page;
