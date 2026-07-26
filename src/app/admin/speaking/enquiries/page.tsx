import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingEnquiries } from "@/lib/admin/speaking/enquiries/queries";
import { ENQUIRY_STATUSES } from "@/lib/admin/speaking/enquiries/constants";
import type { SpeakingEnquiryStatus } from "@/lib/supabase/database.types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "Speaking Enquiries" };

const STATUS_LABELS: Record<SpeakingEnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  discovery: "Discovery",
  proposal_sent: "Proposal Sent",
  negotiating: "Negotiating",
  confirmed: "Confirmed",
  delivered: "Delivered",
  closed: "Closed",
};

export default async function AdminSpeakingEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  await requireAdmin("editor");
  const { status, search } = await searchParams;
  const enquiries = await getAdminSpeakingEnquiries({
    status: status as SpeakingEnquiryStatus | undefined,
    search,
  });

  return (
    <>
      <AdminPageHeader
        title="Speaking Enquiries"
        description="The booking pipeline, from first contact through to delivered engagements."
      />

      <form className="mb-4 flex flex-wrap items-center gap-2">
        <Input name="search" placeholder="Search organisation, contact or email" defaultValue={search} className="max-w-xs" />
        <select name="status" defaultValue={status ?? ""} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
          <option value="">All statuses</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">
          Filter
        </Button>
      </form>

      {enquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No enquiries match these filters.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organisation</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Event type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell className="font-medium">{enquiry.organisation}</TableCell>
                <TableCell>{enquiry.contact_name}</TableCell>
                <TableCell>{enquiry.event_type}</TableCell>
                <TableCell>{enquiry.event_date ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{STATUS_LABELS[enquiry.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/speaking/enquiries/${enquiry.id}`} />}
                  >
                    View
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
