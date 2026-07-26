import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TopicForm } from "@/components/admin/speaking/topic-form";

export const metadata: Metadata = { title: "Add Speaking Topic" };

export default async function NewSpeakingTopicPage() {
  await requireAdmin("editor");

  return (
    <>
      <AdminPageHeader title="Add a speaking topic" description="You can add FAQs after creating it." />
      <TopicForm />
    </>
  );
}
