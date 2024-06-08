'use client'; // Error components must be Client Components

import { useEffect } from 'react';

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
    <div className="mt-20 flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <button
        className="rounded-md bg-primary px-4 py-2"
        onMouseDown={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
