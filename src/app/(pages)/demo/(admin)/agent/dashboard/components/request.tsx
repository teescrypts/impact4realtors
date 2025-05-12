"use client";

import {
  Box,
  Button,
  Paper,
  Tab,
  Tabs,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ConnectType } from "../requests/page";
import { useRouter } from "nextjs-toploader/app";
import EmptyState from "@/app/(pages)/demo/(pages)/components/empty-state";
import { useSearchParams } from "next/navigation";
import { acceptSellerReq } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";

export default function ConnectRequestsTabs({
  connects,
  hasMore,
  lastCreatedAt,
}: {
  connects: ConnectType[];
  hasMore: boolean;
  lastCreatedAt: string;
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (status === "accepted") {
      setTabIndex(1);
    } else {
      setTabIndex(0);
    }
  }, [status]);

  const router = useRouter();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const status = newValue === 0 ? "pending" : "accepted";
    router.push(`/demo/agent/dashboard/requests?status=${status}`);
  };

  console.log(hasMore, lastCreatedAt);

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Pending Requests" />
        <Tab label="Accepted Requests" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <ConnectList connects={connects} action="accept" />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ConnectList connects={connects} action="view" />
      </TabPanel>
    </Box>
  );
}

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box>{children}</Box> : null;
}

function ConnectList({
  connects,
  action,
}: {
  connects: ConnectType[];
  action: "accept" | "view";
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (connects.length === 0) {
    return (
      <>
        <EmptyState
          title={`No ${
            action === "accept" ? "pending" : "accepted"
          } Request found`}
          description={`New ${
            action === "accept" ? "pending" : "accepted"
          } Requests will be displayed here`}
        />
      </>
    );
  }

  return (
    <Stack spacing={2}>
      {message && (
        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {message}
        </Typography>
      )}

      {connects.length > 0 &&
        connects.map((connect) => (
          <Paper key={connect._id} sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {connect.firstName} {connect.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {connect.email} | {connect.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {connect.state}, {connect.zipCode}
                </Typography>
              </Box>
              {action === "accept" && (
                <Button
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    acceptSellerReq(connect._id).then((res) => {
                      if (res) {
                        if (res.error) {
                          setMessage(res.error);
                          setLoading(false);
                        }
                        if (res.message) {
                          notify(res.message);
                          setLoading(false);
                        }
                      }
                    });
                  }}
                  variant="contained"
                  color="primary"
                >
                  Accept Request
                </Button>
              )}
            </Stack>
          </Paper>
        ))}
    </Stack>
  );
}
