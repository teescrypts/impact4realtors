import { format, parse } from "date-fns";

export function convertToAmPmFormat(time: string): string {
  const parsedTime = parse(time, "HH:mm", new Date());
  return format(parsedTime, "hh:mm a");
}
