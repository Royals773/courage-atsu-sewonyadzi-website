import { ServerCrash } from "lucide-react";

/**
 * Shown instead of crashing whenever a page that depends on Supabase can't
 * reach it — either because no project is connected yet (no env vars) or
 * because of a transient query error. See the Step 3 report for setup
 * steps.
 */
export function BackendUnavailable({
  title = "This section is temporarily unavailable",
  description = "We couldn't load this content right now. Please try again shortly.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <ServerCrash className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
