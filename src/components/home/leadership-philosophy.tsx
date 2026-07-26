import { getSettingGroup } from "@/lib/settings/queries";
import { SectionHeading } from "@/components/shared/section-heading";

export async function LeadershipPhilosophy() {
  const [brand, about] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("about"),
  ]);

  return (
    <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Philosophy" title="Leadership philosophy" align="center" />
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          {brand.mission}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {about.values.map((value) => (
            <div key={value} className="rounded-lg border border-border bg-background p-6">
              <p className="text-sm text-foreground/90">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
