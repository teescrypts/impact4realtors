import { format } from "date-fns";

/**
 * Converts a Mongoose createdAt date to a human-readable format.
 * @param date - The createdAt date from Mongoose (ISO format).
 * @param formatStr - Optional format string (default: "PPP p").
 * @returns A formatted date string.
 */
export function formatCreatedAt(
  date: Date | string,
  formatStr: string = "dd MMM yyyy"
): string {
  if (!date) return "Invalid Date";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, formatStr);
}
