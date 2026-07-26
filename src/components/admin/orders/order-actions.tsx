"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  refundOrderAction,
  resendOrderConfirmationAction,
  setOrderTrackingAction,
  updateOrderStatusAction,
} from "@/lib/admin/orders/actions";
import type { OrderStatus } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
];

export function OrderActions({
  orderId,
  status,
  trackingNumber,
  trackingUrl,
  canRefund,
}: {
  orderId: string;
  status: OrderStatus;
  trackingNumber: string | null;
  trackingUrl: string | null;
  canRefund: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, value as OrderStatus);
        toast.success("Order status updated");
      } catch (error) {
        toast.error("Couldn't update status", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleTracking(formData: FormData) {
    startTransition(async () => {
      try {
        await setOrderTrackingAction(
          orderId,
          String(formData.get("tracking_number") ?? ""),
          String(formData.get("tracking_url") ?? "")
        );
        toast.success("Tracking saved");
      } catch (error) {
        toast.error("Couldn't save tracking", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleRefund() {
    startTransition(async () => {
      try {
        await refundOrderAction(orderId);
        toast.success("Refund issued");
      } catch (error) {
        toast.error("Refund failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleResend() {
    startTransition(async () => {
      try {
        await resendOrderConfirmationAction(orderId);
        toast.success("Confirmation email resent");
      } catch (error) {
        toast.error("Couldn't resend email", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form action={handleTracking} className="space-y-3">
          <div>
            <Label htmlFor="tracking_number">Tracking number</Label>
            <Input
              id="tracking_number"
              name="tracking_number"
              defaultValue={trackingNumber ?? ""}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="tracking_url">Tracking URL</Label>
            <Input id="tracking_url" name="tracking_url" defaultValue={trackingUrl ?? ""} className="mt-1.5" />
          </div>
          <Button type="submit" variant="outline" size="sm" disabled={isPending}>
            Save tracking
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" disabled={isPending} onClick={handleResend}>
            Resend confirmation email
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" size="sm" disabled={!canRefund || isPending} />}>
              Refund
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Refund this order?</AlertDialogTitle>
                <AlertDialogDescription>
                  This issues a full refund through Stripe and marks the order as refunded. This
                  can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRefund}>Refund</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
