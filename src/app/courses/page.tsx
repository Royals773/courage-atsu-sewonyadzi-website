import type { Metadata } from "next";

import { courses } from "@/lib/content/courses";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Courses",
  description:
    "Structured learning programmes on leadership, strategy and entrepreneurship — coming soon. Join the priority list.",
  path: "/courses",
});

const categories = [
  { label: "Leadership", value: "leadership" },
  { label: "Care Quality", value: "care-quality" },
  { label: "Entrepreneurship", value: "entrepreneurship" },
];

const benefits = [
  "Practical frameworks drawn directly from the books and speaking work",
  "Built for busy leaders — short, focused modules",
  "Priority-list members get early access and founder pricing",
];

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Coming soon"
        title="Courses Coming Soon"
        description="Structured, practical learning programmes are in development. Join the priority list to be notified first and get founder pricing."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-heading text-2xl font-semibold">
              Course categories
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.value} variant="secondary">
                  {category.label}
                </Badge>
              ))}
            </div>

            <h2 className="mt-10 font-heading text-2xl font-semibold">
              Why join the priority list
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-heading text-2xl font-semibold">
              Planned courses
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="flex flex-col gap-2">
                    <Badge className="w-fit" variant="secondary">
                      Coming soon
                    </Badge>
                    <h3 className="font-heading text-base font-semibold">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card>
              <CardContent>
                <h2 className="font-heading text-xl font-semibold">
                  Join the Priority List
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Registration and email confirmation go live in Phase 3.
                </p>
                <form className="mt-5 space-y-4">
                  <div>
                    <Label htmlFor="courses-name">Name</Label>
                    <Input id="courses-name" name="name" className="mt-1.5" disabled />
                  </div>
                  <div>
                    <Label htmlFor="courses-email">Email</Label>
                    <Input
                      id="courses-email"
                      name="email"
                      type="email"
                      className="mt-1.5"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="courses-interest">
                      Which topic interests you most?
                    </Label>
                    <Input
                      id="courses-interest"
                      name="interest"
                      placeholder="Leadership, strategy, entrepreneurship"
                      className="mt-1.5"
                      disabled
                    />
                  </div>
                  <Button type="submit" disabled className="w-full">
                    Join the Priority List
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
