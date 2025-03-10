"use client"; // Error boundaries must be Client Components

import ErrorComponent from "@/app/component/_error";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <ErrorComponent onRetry={reset} />
    </div>
  );
}
