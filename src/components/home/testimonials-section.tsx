import { getApprovedTestimonials } from "@/lib/testimonials/queries";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";

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
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="What readers, organisers and clients say"
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.id} delay={i * 80}>
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
