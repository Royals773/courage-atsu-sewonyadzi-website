import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <Compass className="size-10 text-muted-foreground/60" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button render={<Link href="/" />}>Back to homepage</Button>
        <Button variant="outline" render={<Link href="/books" />}>
          Browse Books
        </Button>
      </div>
    </div>
  );
}
