"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { deleteSpeakingTopicFaqAction } from "@/lib/admin/speaking/topics/actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TopicFaqDialog } from "@/components/admin/speaking/topic-faq-dialog";
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

interface TopicFaq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

export function TopicFaqsManager({ topicId, faqs }: { topicId: string; faqs: TopicFaq[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteSpeakingTopicFaqAction(topicId, id);
      } catch (error) {
        toast.error("Couldn't delete FAQ", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">FAQs</h2>
        <TopicFaqDialog
          topicId={topicId}
          trigger={
            <Button size="sm" variant="outline">
              <Plus className="size-4" aria-hidden="true" />
              Add FAQ
            </Button>
          }
        />
      </div>

      {faqs.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No FAQs for this topic yet.</p>
      ) : (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md truncate">{faq.question}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <TopicFaqDialog
                    topicId={topicId}
                    faq={faq}
                    trigger={
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button size="sm" variant="outline" disabled={isPending} aria-label="Delete FAQ" />}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(faq.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
