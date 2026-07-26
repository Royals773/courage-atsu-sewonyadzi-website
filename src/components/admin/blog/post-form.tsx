"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createPostAction, updatePostAction } from "@/lib/admin/blog/actions";
import { renderMarkdown } from "@/lib/markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostFormProps {
  post?: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    category_id: string | null;
    seo_title: string | null;
    seo_description: string | null;
    status: string;
    scheduled_at: string | null;
    blog_post_tags: { tag_id: string }[];
  };
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export function PostForm({ post, categories, tags }: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState(post?.status ?? "draft");
  const existingTagNames = tags
    .filter((tag) => post?.blog_post_tags.some((t) => t.tag_id === tag.id))
    .map((tag) => tag.name)
    .join(", ");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (post) {
          await updatePostAction(post.id, formData);
          toast.success("Post updated");
        } else {
          await createPostAction(formData);
        }
      } catch (error) {
        toast.error("Couldn't save post", {
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
              <Input id="title" name="title" defaultValue={post?.title} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={post?.slug} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="content">Content (Markdown)</Label>
            <Tabs defaultValue="write" className="mt-1.5">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div
                  className="min-h-64 rounded-md border border-border p-4 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content || "*Nothing yet*") }}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={post?.category_id ?? undefined}>
                <SelectTrigger id="category_id" className="mt-1.5 w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={existingTagNames} className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" value={status} onValueChange={(value) => setStatus(value ?? "draft")}>
                <SelectTrigger id="status" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "scheduled" ? (
              <div>
                <Label htmlFor="scheduled_at">Publish at</Label>
                <Input
                  id="scheduled_at"
                  name="scheduled_at"
                  type="datetime-local"
                  defaultValue={post?.scheduled_at?.slice(0, 16) ?? ""}
                  className="mt-1.5"
                />
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="seo_title">SEO title</Label>
              <Input id="seo_title" name="seo_title" defaultValue={post?.seo_title ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="seo_description">SEO description</Label>
              <Input
                id="seo_description"
                name="seo_description"
                defaultValue={post?.seo_description ?? ""}
                className="mt-1.5"
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : post ? "Save changes" : "Create post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
