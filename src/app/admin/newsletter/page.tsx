import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getNewsletterSubscribers } from "@/lib/admin/newsletter/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ExportCsvButton } from "@/components/admin/newsletter/export-csv-button";
import { UnsubscribeButton } from "@/components/admin/newsletter/unsubscribe-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Newsletter" };

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminNewsletterPage() {
  await requireAdmin("administrator");
  const subscribers = await getNewsletterSubscribers();
  const activeCount = subscribers.filter((s) => !s.unsubscribed_at).length;

  return (
    <>
      <AdminPageHeader
        title="Newsletter"
        description={`${activeCount} active subscriber${activeCount === 1 ? "" : "s"}`}
        action={<ExportCsvButton subscribers={subscribers} />}
      />

      {subscribers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No subscribers yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell className="font-medium">{subscriber.email}</TableCell>
                <TableCell>{subscriber.first_name ?? "—"}</TableCell>
                <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
                <TableCell>
                  {subscriber.unsubscribed_at ? (
                    <Badge variant="secondary">Unsubscribed</Badge>
                  ) : (
                    <Badge>Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!subscriber.unsubscribed_at ? (
                    <UnsubscribeButton subscriberId={subscriber.id} />
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
