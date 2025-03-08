import { parse, format, add } from "date-fns";

const addDurationToTime = (
  time: string,
  duration: { hours: number; minutes: number }
) => {
  // Parse the time string into a Date object
  const parsedTime = parse(time, "HH:mm", new Date());

  // Add the duration to the time
  const newTime = add(parsedTime, {
    hours: duration.hours,
    minutes: duration.minutes,
  });

  // Format the result back to 24-hour time format
  return format(newTime, "HH:mm");
};

export default addDurationToTime;
