"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { sendCustomerPasswordResetAction, setCustomerBannedAction } from "@/lib/admin/customers/actions";
import { Button } from "@/components/ui/button";

export function CustomerActions({
  userId,
  email,
  isBanned,
}: {
  userId: string;
  email: string;
  isBanned: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleBan() {
    startTransition(async () => {
      try {
        await setCustomerBannedAction(userId, !isBanned);
        toast.success(isBanned ? "Account re-enabled" : "Account disabled");
      } catch (error) {
        toast.error("Couldn't update account", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleResetPassword() {
    startTransition(async () => {
      try {
        await sendCustomerPasswordResetAction(email);
        toast.success("Password reset email sent");
      } catch (error) {
        toast.error("Couldn't send reset email", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleResetPassword}>
        Send password reset
      </Button>
      <Button
        variant={isBanned ? "outline" : "destructive"}
        size="sm"
        disabled={isPending}
        onClick={handleToggleBan}
      >
        {isBanned ? "Re-enable account" : "Disable account"}
      </Button>
    </div>
  );
}
