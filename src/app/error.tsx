"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled page error", { error, digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <AlertTriangle className="size-10 text-muted-foreground/60" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="mt-2 text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again,
        or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to homepage
        </Button>
      </div>
    </div>
  );
}
