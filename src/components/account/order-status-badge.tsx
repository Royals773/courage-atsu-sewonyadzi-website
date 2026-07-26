import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/supabase/database.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const NEGATIVE_STATUSES = new Set<OrderStatus>(["cancelled", "refunded"]);

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={NEGATIVE_STATUSES.has(status) ? "destructive" : "secondary"}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
