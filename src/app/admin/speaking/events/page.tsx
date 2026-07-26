import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingEvents } from "@/lib/admin/speaking/events/queries";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Speaking Events" };

export default async function AdminSpeakingEventsPage() {
  await requireAdmin("administrator");
  const events = await getAdminSpeakingEvents();

  return (
    <>
      <AdminPageHeader
        title="Speaking Events"
        description="Confirmed engagements — client, venue, fee and presentation materials."
        action={
          <Button render={<Link href="/admin/speaking/events/new" />}>
            <Plus className="size-4" aria-hidden="true" />
            Add Event
          </Button>
        }
      />

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Public</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.client}</TableCell>
                <TableCell>{event.event_date}</TableCell>
                <TableCell>{event.speaking_topics?.title ?? "—"}</TableCell>
                <TableCell>{event.fee_amount ? formatPrice(event.fee_amount / 100) : "—"}</TableCell>
                <TableCell>
                  <Badge variant={event.is_public ? "default" : "secondary"}>
                    {event.is_public ? "Public" : "Private"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/speaking/events/${event.id}`} />}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
