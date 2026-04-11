"use client";
import {
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { updateLeadStatus } from "@/app/actions/server-actions";

export default function useLeadDragDrop({
  setUpdatingLeads,
  setCurrentLeads,
  notify,
}: {
  setUpdatingLeads: Dispatch<SetStateAction<boolean>>;
  setCurrentLeads: Dispatch<SetStateAction<any[]>>;
  notify: (message: string) => void;
}) {
  const [activeLead, setActiveLead] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 10 },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setUpdatingLeads(true);
      setCurrentLeads((prev) =>
        prev.map((lead) =>
          lead._id === active.id
            ? { ...lead, status: over.id.toString().toLowerCase() }
            : lead
        )
      );

      updateLeadStatus(
        over.id.toString().toLowerCase(),
        active.id.toString()
      ).then((res) => {
        if (res?.error) notify(res.error);
        else if (res?.message) notify(res.message);
        setUpdatingLeads(false);
      });

      setActiveLead(null);
    },
    [setUpdatingLeads, setCurrentLeads, notify]
  );

  return { sensors, handleDragEnd, activeLead, setActiveLead };
}
