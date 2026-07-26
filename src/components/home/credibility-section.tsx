import { getSettingGroup } from "@/lib/settings/queries";

export async function CredibilitySection() {
  const credibility = await getSettingGroup("credibility");

  const stats = [
    { label: "Years of experience", value: credibility.yearsExperience },
    { label: "People reached", value: credibility.peopleReached },
    { label: "Organisations supported", value: credibility.organisationsSupported },
    { label: "Books published", value: credibility.booksPublished },
    { label: "Speaking engagements delivered", value: credibility.speakingEngagements },
    { label: "Countries & communities reached", value: credibility.countriesReached },
  ];

  return (
    <section className="border-b border-border py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-semibold text-gold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
