import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingEnquiryById } from "@/lib/admin/speaking/enquiries/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EnquiryActions } from "@/components/admin/speaking/enquiry-actions";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Speaking Enquiry" };

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm text-foreground/90">{value ?? "—"}</p>
    </div>
  );
}

export default async function AdminSpeakingEnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("editor");
  const { id } = await params;
  const enquiry = await getAdminSpeakingEnquiryById(id);
  if (!enquiry) notFound();

  return (
    <>
      <AdminPageHeader title={enquiry.organisation} description={enquiry.email} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Organisation" value={enquiry.organisation} />
            <Field label="Contact name" value={enquiry.contact_name} />
            <Field label="Email" value={enquiry.email} />
            <Field label="Phone" value={enquiry.phone} />
            <Field label="Event type" value={enquiry.event_type} />
            <Field label="Venue" value={enquiry.venue} />
            <Field label="Country" value={enquiry.country} />
            <Field label="Audience size" value={enquiry.audience_size} />
            <Field label="Event date" value={enquiry.event_date} />
            <Field label="Budget" value={enquiry.budget_range} />
            <Field label="Preferred topic" value={enquiry.speaking_topics?.title ?? null} />
            <Field label="Received" value={new Date(enquiry.created_at).toLocaleString("en-GB")} />
            <div className="sm:col-span-2">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Additional notes
              </p>
              <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
                {enquiry.notes ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <EnquiryActions enquiryId={enquiry.id} status={enquiry.status} adminNotes={enquiry.admin_notes} />
      </div>
    </>
  );
}
