import dayjs from "dayjs";

export function getDateRange(
  view: string,
  date: Date
): { start: string; end: string } {
  const d = dayjs(date);

  switch (view) {
    case "dayGridMonth":
      return {
        start: d.startOf("month").toISOString(),
        end: d.endOf("month").toISOString(),
      };

    case "timeGridWeek":
      return {
        start: d.startOf("week").toISOString(), // assumes Sunday start
        end: d.endOf("week").toISOString(),
      };

    case "timeGridDay":
      return {
        start: d.startOf("day").toISOString(),
        end: d.endOf("day").toISOString(),
      };

    default:
      return {
        start: d.startOf("month").toISOString(),
        end: d.endOf("month").toISOString(),
      };
  }
}
