import Link from "next/link";

import { courses } from "@/lib/content/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

export function FutureCoursesSection() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Coming soon"
          title="Courses and Learning Programmes Coming Soon"
          description="A future home for structured, practical learning on leadership, care quality and entrepreneurship — built on the same experience behind the books and speaking work."
          align="center"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex flex-col gap-3">
                <Badge variant="secondary" className="w-fit">
                  Coming soon
                </Badge>
                <h3 className="font-heading text-lg font-semibold">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button size="lg" render={<Link href="/courses" />}>
            Join the Priority List
          </Button>
        </div>
      </div>
    </section>
  );
}
