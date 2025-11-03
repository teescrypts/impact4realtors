// app/component/schedule/useScheduleState.ts
import { DateItem } from "@/types";
import { useState, useEffect, useRef, useCallback } from "react";
import SimpleBarCore from "simplebar-core";

export function useScheduleState(
  dates: DateItem[] | undefined,
  onDateClicked: (date: DateItem) => void,
  onTimeClicked: (slot: string) => void
) {
  const [selectedDate, setSelectedDate] = useState<DateItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProgrammaticScroll, setIsProgrammaticScroll] =
    useState<boolean>(false);
  const [visibleSlots, setVisibleSlots] = useState<number>(10);

  const scrollbarRef = useRef<SimpleBarCore | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!dates?.length) {
      setSelectedDate(null);
      setSelectedSlot("");
      setCurrentIndex(0);
    } else {
      setVisibleSlots(10);
    }
  }, [dates]);

  const handleDateClick = useCallback(
    (date: DateItem, idx: number) => {
      if (!date || date.slots.length === 0) return;
      setSelectedDate(date);
      setSelectedSlot("");
      setCurrentIndex(idx);
      onDateClicked(date);
      setVisibleSlots(10);
    },
    [onDateClicked]
  );

  const handleTimeClick = useCallback(
    (slot: string) => {
      setSelectedSlot(slot);
      onTimeClicked(slot);
    },
    [onTimeClicked]
  );

  const handleShowMore = useCallback(() => setVisibleSlots((v) => v + 10), []);

  return {
    selectedDate,
    selectedSlot,
    currentIndex,
    visibleSlots,
    scrollbarRef,
    scrollContainerRef,
    setCurrentIndex,
    handleDateClick,
    handleTimeClick,
    handleShowMore,
    setSelectedDate,
    setSelectedSlot,
    isProgrammaticScroll,
    setIsProgrammaticScroll,
  } as const;
}
