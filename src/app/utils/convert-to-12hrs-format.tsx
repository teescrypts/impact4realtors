import { parse, format } from "date-fns";

export const convertTo12HourFormat = (time24: string): string => {
  try {
    const parsedTime = parse(time24, "HH:mm", new Date());

    return format(parsedTime, "hh:mm a");
  } catch (error) {
    console.log(error);
    throw new Error(
      "Invalid time format. Ensure the input is in HH:mm format. "
    );
  }
};
