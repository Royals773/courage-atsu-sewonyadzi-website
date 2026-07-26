"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { createSpeakingTopicAction, updateSpeakingTopicAction } from "@/lib/admin/speaking/topics/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface TopicFormProps {
  topic?: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    learning_objectives: string[];
    audience: string | null;
    duration: string | null;
    delivery_format: string[];
    is_featured: boolean;
    is_published: boolean;
    position: number;
  };
}

export function TopicForm({ topic }: TopicFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (topic) {
          await updateSpeakingTopicAction(topic.id, formData);
          toast.success("Topic updated");
        } else {
          await createSpeakingTopicAction(formData);
        }
      } catch (error) {
        toast.error("Couldn't save topic", {
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
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={topic?.title} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="slug">Slug (leave blank to generate from title)</Label>
              <Input id="slug" name="slug" defaultValue={topic?.slug} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" name="summary" defaultValue={topic?.summary} rows={3} required className="mt-1.5" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="audience">Audience</Label>
              <Input id="audience" name="audience" defaultValue={topic?.audience ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="45-60 minutes"
                defaultValue={topic?.duration ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                type="number"
                defaultValue={topic?.position ?? 0}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="delivery_format">Delivery formats (comma separated)</Label>
            <Input
              id="delivery_format"
              name="delivery_format"
              placeholder="Keynote, Workshop, Virtual"
              defaultValue={topic?.delivery_format.join(", ") ?? ""}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="learning_objectives">Learning objectives (one per line)</Label>
            <Textarea
              id="learning_objectives"
              name="learning_objectives"
              defaultValue={topic?.learning_objectives.join("\n") ?? ""}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_featured" defaultChecked={topic?.is_featured} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_published" defaultChecked={topic?.is_published ?? true} />
              Published
            </label>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : topic ? "Save changes" : "Create topic"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
