import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminSpeakingEventById } from "@/lib/admin/speaking/events/queries";
import { getAdminSpeakingTopics } from "@/lib/admin/speaking/topics/queries";
import { deleteSpeakingEventAction } from "@/lib/admin/speaking/events/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventForm } from "@/components/admin/speaking/event-form";
import { EventPresentationUpload } from "@/components/admin/speaking/event-presentation-upload";
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

export const metadata: Metadata = { title: "Edit Speaking Event" };

export default async function EditSpeakingEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("administrator");
  const { id } = await params;
  const [event, topics] = await Promise.all([getAdminSpeakingEventById(id), getAdminSpeakingTopics()]);
  if (!event) notFound();

  return (
    <>
      <AdminPageHeader
        title={event.client}
        description={event.event_date}
        action={
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <form action={deleteSpeakingEventAction.bind(null, event.id)}>
                  <AlertDialogAction type="submit">Delete</AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />

      <EventForm event={event} topics={topics} />

      <Separator className="my-8" />
      <EventPresentationUpload eventId={event.id} currentPath={event.presentation_storage_path} />
    </>
  );
}
