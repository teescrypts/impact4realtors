"use client";

import { useState, useCallback, useEffect } from "react";
import { deleteLead, fetchMoreLeads } from "@/app/actions/server-actions";
import { LeadType } from "../(pages)/demo/(admin)/dashboard/lead/page";

export default function useLeadData({
  leads,
  hasMore,
  lastCreatedAt,
  notify
}: 
{
  leads: LeadType[];
  hasMore: boolean;
  lastCreatedAt: Date | null;
  notify: (message: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("House Tour Leads");
  const [currentLeads, setCurrentLeads] = useState<LeadType[]>(leads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentHasMore, setCurrentHasMore] = useState<boolean>(hasMore);
  const [currentLastCreated, setCurrentLastCreated] = useState<Date | null>(
    lastCreatedAt
  );
  const [updatingLeads, setUpdatingLeads] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCurrentLeads(leads);
    setCurrentHasMore(hasMore);
    if (lastCreatedAt) setCurrentLastCreated(lastCreatedAt);
  }, [leads, hasMore, lastCreatedAt]);

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleBulkDelete = () => {
    if (!selectedLeads.length) return;
    selectedLeads.forEach((id) => deleteLead(id));
    notify("Leads deleted");
    setSelectedLeads([]);
  };

  const HandleLoadmore = useCallback(() => {
    if (selectedCategory && currentLastCreated) {
      fetchMoreLeads(selectedCategory, currentLastCreated).then((result) => {
        if (result?.error) setMessage(result.error);
        if (result?.data) {
          setCurrentLeads((prev) => [...prev, ...result.data.leads]);
          setCurrentHasMore(result.data.hasMore);
          if (result.data.lastCreatedAt)
            setCurrentLastCreated(result.data.lastCreatedAt);
        }
      });
    }
  }, [selectedCategory, currentLastCreated]);

  return {
    selectedCategory: { value: selectedCategory, set: setSelectedCategory },
    currentLeads: { value: currentLeads, set: setCurrentLeads },
    selectedLeads: { value: selectedLeads, set: setSelectedLeads },
    currentHasMore: { value: currentHasMore, set: setCurrentHasMore },
    updatingLeads: { value: updatingLeads, set: setUpdatingLeads },
    message,
    HandleLoadmore,
    toggleLeadSelection,
    handleBulkDelete,
    setSelectedCategory,
  };
}
