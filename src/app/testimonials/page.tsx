import type { Metadata } from "next";

import { testimonials } from "@/lib/content/testimonials";
import type { TestimonialCategory } from "@/lib/content/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Feedback from readers, event organisers, business clients and care-sector leaders.",
};

const categoryLabels: Record<TestimonialCategory, string> = {
  "book-review": "Book Reviews",
  speaking: "Speaking Testimonials",
  consulting: "Consulting Testimonials",
  "event-organiser": "Event Organiser Feedback",
  media: "Media Comments",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsPage() {
  const categories = Object.keys(categoryLabels) as TestimonialCategory[];

  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="What people say"
        description="Only approved testimonials appear publicly. Everything shown here is a clearly-marked placeholder pending real feedback."
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6 lg:px-8">
        {categories.map((category) => {
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
        })}
        <p className="text-center text-xs text-muted-foreground/70">
          Sample testimonials shown for illustrative purposes only.
        </p>
      </div>
    </>
  );
}
