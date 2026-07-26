"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { unsubscribeNewsletterAction } from "@/lib/admin/newsletter/actions";
import { Button } from "@/components/ui/button";

export function UnsubscribeButton({ subscriberId }: { subscriberId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await unsubscribeNewsletterAction(subscriberId);
        toast.success("Unsubscribed");
      } catch (error) {
        toast.error("Couldn't unsubscribe", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Button variant="ghost" size="sm" disabled={isPending} onClick={handleClick}>
      Unsubscribe
    </Button>
  );
}
