import { getSettingGroup } from "@/lib/settings/queries";
import { Reveal } from "@/components/shared/reveal";
import { CountUp } from "@/components/shared/count-up";

export async function SpeakerStats() {
  const credibility = await getSettingGroup("credibility");

  const stats = [
    { label: "Events delivered", value: credibility.eventsDelivered },
    { label: "Countries spoken in", value: credibility.countriesSpokenIn },
    { label: "Audience members reached", value: credibility.audienceReached },
    { label: "Client satisfaction", value: credibility.clientSatisfaction },
  ];

  return (
    <section className="border-b border-border bg-secondary/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-semibold text-gold sm:text-4xl">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
