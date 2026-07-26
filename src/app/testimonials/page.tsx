import type { Metadata } from "next";

import { getApprovedTestimonials } from "@/lib/testimonials/queries";
import type { TestimonialCategory } from "@/lib/supabase/database.types";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description:
    "Feedback from readers, event organisers, business clients and care-sector leaders.",
  path: "/testimonials",
});

const categoryLabels: Record<TestimonialCategory, string> = {
  conferences: "Conference Feedback",
  leadership: "Leadership Testimonials",
  corporate: "Corporate Testimonials",
  training: "Training Feedback",
  books: "Book Reviews",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function TestimonialsPage() {
  const testimonials = await getApprovedTestimonials();
  const categories = Object.keys(categoryLabels) as TestimonialCategory[];

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="What people say"
        description="Only approved testimonials appear publicly."
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        {testimonials.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No testimonials published yet — check back soon.
          </p>
        ) : (
          categories.map((category) => {
            const items = testimonials.filter((t) => t.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="font-heading text-2xl font-semibold">
                  {categoryLabels[category]}
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((testimonial) => (
                    <Card key={testimonial.id}>
                      <CardContent className="flex h-full flex-col gap-4">
                        <p className="text-sm text-pretty text-foreground/90">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className="mt-auto flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {initials(testimonial.authorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {testimonial.authorName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.authorRole}, {testimonial.organisation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
