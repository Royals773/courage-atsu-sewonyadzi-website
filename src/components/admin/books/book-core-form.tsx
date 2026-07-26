"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { createBookAction, updateBookAction } from "@/lib/admin/books/actions";
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

interface BookCoreFormProps {
  book?: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    author_note: string | null;
    publication_date: string | null;
    featured: boolean;
    is_new: boolean;
    has_sample_chapter: boolean;
    status: string;
    popularity_score: number;
    key_lessons: string[];
    who_its_for: string[];
    why_it_matters: string | null;
    practical_outcomes: string[];
    table_of_contents: { title: string }[];
    book_category_books: { category_id: string }[];
  };
  categories: { id: string; name: string }[];
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function BookCoreForm({ book, categories }: BookCoreFormProps) {
  const [isPending, startTransition] = useTransition();
  const selectedCategoryIds = new Set(book?.book_category_books.map((c) => c.category_id) ?? []);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (book) {
          await updateBookAction(book.id, formData);
          toast.success("Book updated");
        } else {
          await createBookAction(formData);
        }
      } catch (error) {
        toast.error("Couldn't save book", {
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
              <Input id="title" name="title" defaultValue={book?.title} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="slug">Slug (leave blank to generate from title)</Label>
              <Input id="slug" name="slug" defaultValue={book?.slug} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" defaultValue={book?.subtitle ?? ""} className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={book?.description ?? ""}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="author_note">Author&apos;s note</Label>
            <Textarea
              id="author_note"
              name="author_note"
              defaultValue={book?.author_note ?? ""}
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="publication_date">Publication date</Label>
              <Input
                id="publication_date"
                name="publication_date"
                type="date"
                defaultValue={book?.publication_date ?? ""}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={book?.status ?? "draft"}>
                <SelectTrigger id="status" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="popularity_score">Popularity score</Label>
              <Input
                id="popularity_score"
                name="popularity_score"
                type="number"
                defaultValue={book?.popularity_score ?? 0}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="featured" defaultChecked={book?.featured} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="is_new" defaultChecked={book?.is_new} />
              Mark as new
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="has_sample_chapter" defaultChecked={book?.has_sample_chapter} />
              Has sample chapter
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Categories</p>
            <div className="mt-2 flex flex-wrap gap-4">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    name="category_ids"
                    value={category.id}
                    defaultChecked={selectedCategoryIds.has(category.id)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="why_it_matters">Why it matters</Label>
            <Textarea
              id="why_it_matters"
              name="why_it_matters"
              defaultValue={book?.why_it_matters ?? ""}
              rows={2}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="who_its_for">Who it&apos;s for (one per line)</Label>
            <Textarea
              id="who_its_for"
              name="who_its_for"
              defaultValue={book?.who_its_for.join("\n") ?? ""}
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="practical_outcomes">Practical outcomes (one per line)</Label>
            <Textarea
              id="practical_outcomes"
              name="practical_outcomes"
              defaultValue={book?.practical_outcomes.join("\n") ?? ""}
              rows={3}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="key_lessons">Leadership insights (one per line)</Label>
            <Textarea
              id="key_lessons"
              name="key_lessons"
              defaultValue={book?.key_lessons.join("\n") ?? ""}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="table_of_contents">Table of contents (one entry per line)</Label>
            <Textarea
              id="table_of_contents"
              name="table_of_contents"
              defaultValue={book?.table_of_contents.map((entry) => entry.title).join("\n") ?? ""}
              rows={4}
              className="mt-1.5"
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : book ? "Save changes" : "Create book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
