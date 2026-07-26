"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { upsertSpeakingTopicFaqAction } from "@/lib/admin/speaking/topics/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TopicFaqDialogProps {
  topicId: string;
  trigger: React.ReactNode;
  faq?: { id: string; question: string; answer: string; position: number };
}

export function TopicFaqDialog({ topicId, trigger, faq }: TopicFaqDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await upsertSpeakingTopicFaqAction(topicId, formData);
        toast.success(faq ? "FAQ updated" : "FAQ added");
        setOpen(false);
      } catch (error) {
        toast.error("Couldn't save FAQ", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {faq ? <input type="hidden" name="id" value={faq.id} /> : null}
          <div>
            <Label htmlFor="question">Question</Label>
            <Input id="question" name="question" defaultValue={faq?.question} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" name="answer" defaultValue={faq?.answer} rows={3} required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" type="number" defaultValue={faq?.position ?? 0} className="mt-1.5" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
