import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { getUpcomingPublicEvents } from "@/lib/speaking/events";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function UpcomingEvents() {
  const events = await getUpcomingPublicEvents();
  if (events.length === 0) return null;

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Calendar" title="Upcoming events" align="center" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <p className="font-medium">{formatEventDate(event.eventDate)}</p>
                  {event.topicTitle ? (
                    <p className="mt-1 text-sm text-foreground/90">{event.topicTitle}</p>
                  ) : null}
                  {event.venue ? (
                    <p className="mt-1 text-sm text-muted-foreground">{event.venue}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" render={<Link href="/speaking/enquiry" />}>
            Book Me to Speak
          </Button>
        </div>
      </div>
    </section>
  );
}
