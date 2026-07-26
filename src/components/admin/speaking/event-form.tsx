"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { createSpeakingEventAction, updateSpeakingEventAction } from "@/lib/admin/speaking/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventFormProps {
  event?: {
    id: string;
    client: string;
    venue: string | null;
    event_date: string;
    topic_id: string | null;
    fee_amount: number | null;
    expenses_amount: number | null;
    notes: string | null;
    is_public: boolean;
  };
  topics: { id: string; title: string }[];
}

export function EventForm({ event, topics }: EventFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (event) {
          await updateSpeakingEventAction(event.id, formData);
          toast.success("Event updated");
        } else {
          await createSpeakingEventAction(formData);
        }
      } catch (error) {
        toast.error("Couldn't save event", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="client">Client</Label>
              <Input id="client" name="client" defaultValue={event?.client} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" name="venue" defaultValue={event?.venue ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="event_date">Event date</Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                defaultValue={event?.event_date ?? ""}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="topic_id">Topic</Label>
              <Select name="topic_id" defaultValue={event?.topic_id ?? undefined}>
                <SelectTrigger id="topic_id" className="mt-1.5 w-full">
                  <SelectValue placeholder="No topic set" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fee_amount">Fee (£)</Label>
              <Input
                id="fee_amount"
                name="fee_amount"
                type="number"
                step="0.01"
                defaultValue={event?.fee_amount ? (event.fee_amount / 100).toFixed(2) : ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="expenses_amount">Expenses (£)</Label>
              <Input
                id="expenses_amount"
                name="expenses_amount"
                type="number"
                step="0.01"
                defaultValue={event?.expenses_amount ? (event.expenses_amount / 100).toFixed(2) : ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={event?.notes ?? ""} rows={4} className="mt-1.5" />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="is_public" defaultChecked={event?.is_public} />
            Show on public &ldquo;Upcoming events&rdquo; list
          </label>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : event ? "Save changes" : "Create event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
