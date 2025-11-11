"use client";
import { Stack } from "@mui/material";
import EmptyState from "../../../../(pages)/components/empty-state";

export default function LeadEmptyState({ category }: { category: string }) {
  return (
    <Stack justifyContent="center" alignItems="center">
      <EmptyState
        title={`No ${category.toLowerCase()}`}
        description="You will receive notifications about new leads."
      />
    </Stack>
  );
}
