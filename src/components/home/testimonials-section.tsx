import { getApprovedTestimonials } from "@/lib/testimonials/queries";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function TestimonialsSection() {
  const testimonials = (await getApprovedTestimonials()).filter((t) => t.isFeatured);
  if (testimonials.length === 0) return null;

  return (
    <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What readers, organisers and clients say"
          align="center"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
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
    </section>
  );
}
