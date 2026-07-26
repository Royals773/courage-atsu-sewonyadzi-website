import { getSettingGroup } from "@/lib/settings/queries";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export async function LeadershipPhilosophy() {
  const [brand, about] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("about"),
  ]);

  return (
    <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="Philosophy" title="Leadership philosophy" align="center" />
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            {brand.mission}
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {about.values.map((value, i) => (
            <Reveal key={value} delay={i * 80}>
              <div className="h-full rounded-xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-sm text-foreground/90">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
