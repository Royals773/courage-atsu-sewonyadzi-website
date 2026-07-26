"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled admin error", { error, digest: error.digest });
  }, [error]);

  return (
    <div className="flex flex-col items-center px-4 py-24 text-center">
      <AlertTriangle className="size-10 text-muted-foreground/60" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        This admin page hit an unexpected error. Try again, or go back to the
        dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" render={<Link href="/admin" />}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
