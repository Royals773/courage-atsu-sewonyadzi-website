import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * lucide-react no longer ships brand/logo icons, so X/LinkedIn/Facebook are
 * rendered as short text badges instead of guessed-at generic icons.
 */
export function ShareLinks({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        render={
          <a
            href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          />
        }
      >
        X
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          />
        }
      >
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          />
        }
      >
        Facebook
      </Button>
      <Button
        variant="outline"
        size="icon"
        render={
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            aria-label="Share via email"
          />
        }
      >
        <Mail className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
