import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingTopics } from "@/lib/admin/speaking/topics/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/speaking/event-form";

export const metadata: Metadata = { title: "Add Speaking Event" };

export default async function NewSpeakingEventPage() {
  await requireAdmin("administrator");
  const topics = await getAdminSpeakingTopics();

  return (
    <>
      <AdminPageHeader title="Add a speaking event" description="You can attach a presentation file after creating it." />
      <EventForm topics={topics} />
    </>
  );
}
