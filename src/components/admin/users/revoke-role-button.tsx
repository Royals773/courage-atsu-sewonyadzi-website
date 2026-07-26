"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { revokeAdminRoleAction } from "@/lib/admin/users/actions";
import { Button } from "@/components/ui/button";

export function RevokeRoleButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await revokeAdminRoleAction(userId);
        toast.success("Admin access revoked");
      } catch (error) {
        toast.error("Couldn't revoke access", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Button variant="ghost" size="sm" disabled={isPending} onClick={handleClick}>
      Revoke
    </Button>
  );
}
