import { getSettingGroup } from "@/lib/settings/queries";
import { NewsletterForm } from "@/components/home/newsletter-form";

export async function NewsletterSection() {
  const newsletter = await getSettingGroup("newsletter");

  return (
    <NewsletterForm
      headline={newsletter.headline}
      description={newsletter.description}
      consentText={newsletter.consentText}
    />
  );
}
