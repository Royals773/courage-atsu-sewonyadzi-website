import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingTopicById } from "@/lib/admin/speaking/topics/queries";
import { deleteSpeakingTopicAction } from "@/lib/admin/speaking/topics/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TopicForm } from "@/components/admin/speaking/topic-form";
import { TopicFaqsManager } from "@/components/admin/speaking/topic-faqs-manager";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

export const metadata: Metadata = { title: "Edit Speaking Topic" };

export default async function EditSpeakingTopicPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("editor");
  const { id } = await params;
  const topic = await getAdminSpeakingTopicById(id);
  if (!topic) notFound();

  return (
    <>
      <AdminPageHeader
        title={topic.title}
        description={`/speaking/topics/${topic.slug}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/speaking/topics/${topic.slug}`} target="_blank" />}
            >
              View live
            </Button>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this topic?</AlertDialogTitle>
                  <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <form action={deleteSpeakingTopicAction.bind(null, topic.id)}>
                    <AlertDialogAction type="submit">Delete</AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <TopicForm topic={topic} />

      <Separator className="my-8" />
      <TopicFaqsManager
        topicId={topic.id}
        faqs={[...topic.speaking_topic_faqs].sort((a, b) => a.position - b.position)}
      />
    </>
  );
}
