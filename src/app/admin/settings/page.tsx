import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getSettingGroup } from "@/lib/settings/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { ImageUploadForm } from "@/components/admin/settings/image-upload-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveAboutSettingsAction,
  saveContactSettingsAction,
  saveCredibilitySettingsAction,
  saveGeneralSettingsAction,
  saveHeroSettingsAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction,
  uploadAuthorPhotoAction,
  uploadLogoAction,
} from "@/lib/admin/settings/actions";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin("administrator");

  const [general, contact, social, seo, hero, about, credibility] = await Promise.all([
    getSettingGroup("general"),
    getSettingGroup("contact"),
    getSettingGroup("social"),
    getSettingGroup("seo"),
    getSettingGroup("hero"),
    getSettingGroup("about"),
    getSettingGroup("credibility"),
  ]);

  const timelineText = about.timeline.map((item) => `${item.year} — ${item.label}`).join("\n");

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Brand, contact, social, SEO, homepage hero, about page and credibility content."
      />

      <div className="space-y-6">
        <ImageUploadForm
          title="Logo"
          hasImage={Boolean(general.logoPath)}
          emptyNote="No logo uploaded — the brand name is shown as text."
          action={uploadLogoAction}
        />

        <ImageUploadForm
          title="Author photo"
          hasImage={Boolean(general.authorPhotoPath)}
          emptyNote="No photo uploaded — a placeholder is shown on the homepage, about and speaking pages."
          action={uploadAuthorPhotoAction}
        />

        <SettingsForm title="General" action={saveGeneralSettingsAction}>
          <div>
            <Label htmlFor="brandName">Brand name</Label>
            <Input id="brandName" name="brandName" defaultValue={general.brandName} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" defaultValue={general.tagline} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="shortBio">Short bio</Label>
            <Textarea id="shortBio" name="shortBio" defaultValue={general.shortBio} rows={3} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="primaryColor">Primary colour (OKLCH or hex)</Label>
              <Input
                id="primaryColor"
                name="primaryColor"
                defaultValue={general.primaryColor ?? ""}
                placeholder="Leave blank for default"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="accentColor">Accent colour (OKLCH or hex)</Label>
              <Input
                id="accentColor"
                name="accentColor"
                defaultValue={general.accentColor ?? ""}
                placeholder="Leave blank for default"
                className="mt-1.5"
              />
            </div>
          </div>
          <input type="hidden" name="logoPath" value={general.logoPath ?? ""} />
        </SettingsForm>

        <SettingsForm title="Homepage hero" action={saveHeroSettingsAction}>
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Textarea id="headline" name="headline" defaultValue={hero.headline} rows={2} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="subheading">Subheading</Label>
            <Textarea id="subheading" name="subheading" defaultValue={hero.subheading} rows={2} className="mt-1.5" />
          </div>
        </SettingsForm>

        <SettingsForm title="Contact details" action={saveContactSettingsAction}>
          <div>
            <Label htmlFor="email">General enquiries email</Label>
            <Input id="email" name="email" type="email" defaultValue={contact.email} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="speakingEmail">Speaking enquiries email</Label>
            <Input
              id="speakingEmail"
              name="speakingEmail"
              type="email"
              defaultValue={contact.speakingEmail}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="mediaEmail">Media enquiries email</Label>
            <Input id="mediaEmail" name="mediaEmail" type="email" defaultValue={contact.mediaEmail} className="mt-1.5" />
          </div>
        </SettingsForm>

        <SettingsForm title="Social links" action={saveSocialSettingsAction}>
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" name="linkedin" defaultValue={social.linkedin} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input id="instagram" name="instagram" defaultValue={social.instagram} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input id="youtube" name="youtube" defaultValue={social.youtube} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="x">X (Twitter) URL</Label>
            <Input id="x" name="x" defaultValue={social.x} className="mt-1.5" />
          </div>
        </SettingsForm>

        <SettingsForm title="SEO defaults" action={saveSeoSettingsAction}>
          <div>
            <Label htmlFor="defaultTitle">Default page title</Label>
            <Input id="defaultTitle" name="defaultTitle" defaultValue={seo.defaultTitle} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="defaultDescription">Default meta description</Label>
            <Textarea
              id="defaultDescription"
              name="defaultDescription"
              defaultValue={seo.defaultDescription}
              rows={2}
              className="mt-1.5"
            />
          </div>
        </SettingsForm>

        <SettingsForm title="About page" action={saveAboutSettingsAction}>
          <div>
            <Label htmlFor="heroIntro">Hero introduction</Label>
            <Textarea id="heroIntro" name="heroIntro" defaultValue={about.heroIntro} rows={2} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="professionalJourney">Professional journey</Label>
            <Textarea
              id="professionalJourney"
              name="professionalJourney"
              defaultValue={about.professionalJourney}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="leadershipExperience">Leadership experience</Label>
            <Textarea
              id="leadershipExperience"
              name="leadershipExperience"
              defaultValue={about.leadershipExperience}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="motivationForWriting">Motivation for writing</Label>
            <Textarea
              id="motivationForWriting"
              name="motivationForWriting"
              defaultValue={about.motivationForWriting}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="speakingMission">Speaking mission</Label>
            <Textarea
              id="speakingMission"
              name="speakingMission"
              defaultValue={about.speakingMission}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="expertiseAreas">Areas of expertise (one per line)</Label>
            <Textarea
              id="expertiseAreas"
              name="expertiseAreas"
              defaultValue={about.expertiseAreas.join("\n")}
              rows={4}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="values">Values (one per line)</Label>
            <Textarea id="values" name="values" defaultValue={about.values.join("\n")} rows={3} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="timeline">Timeline — one entry per line, as &quot;Year — Milestone&quot;</Label>
            <Textarea id="timeline" name="timeline" defaultValue={timelineText} rows={4} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="achievements">Selected achievements (one per line)</Label>
            <Textarea
              id="achievements"
              name="achievements"
              defaultValue={about.achievements.join("\n")}
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="mediaBiography">Media biography</Label>
            <Textarea
              id="mediaBiography"
              name="mediaBiography"
              defaultValue={about.mediaBiography}
              rows={3}
              className="mt-1.5"
            />
          </div>
        </SettingsForm>

        <SettingsForm title="Credibility stats" action={saveCredibilitySettingsAction}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="yearsExperience">Years of experience</Label>
              <Input id="yearsExperience" name="yearsExperience" defaultValue={credibility.yearsExperience} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="peopleReached">People reached</Label>
              <Input id="peopleReached" name="peopleReached" defaultValue={credibility.peopleReached} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="organisationsSupported">Organisations supported</Label>
              <Input
                id="organisationsSupported"
                name="organisationsSupported"
                defaultValue={credibility.organisationsSupported}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="booksPublished">Books published</Label>
              <Input id="booksPublished" name="booksPublished" defaultValue={credibility.booksPublished} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="speakingEngagements">Speaking engagements delivered</Label>
              <Input
                id="speakingEngagements"
                name="speakingEngagements"
                defaultValue={credibility.speakingEngagements}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="countriesReached">Countries &amp; communities reached</Label>
              <Input
                id="countriesReached"
                name="countriesReached"
                defaultValue={credibility.countriesReached}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="eventsDelivered">Speaking: events delivered</Label>
              <Input id="eventsDelivered" name="eventsDelivered" defaultValue={credibility.eventsDelivered} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="countriesSpokenIn">Speaking: countries spoken in</Label>
              <Input
                id="countriesSpokenIn"
                name="countriesSpokenIn"
                defaultValue={credibility.countriesSpokenIn}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="audienceReached">Speaking: audience members reached</Label>
              <Input id="audienceReached" name="audienceReached" defaultValue={credibility.audienceReached} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="clientSatisfaction">Speaking: client satisfaction</Label>
              <Input
                id="clientSatisfaction"
                name="clientSatisfaction"
                defaultValue={credibility.clientSatisfaction}
                className="mt-1.5"
              />
            </div>
          </div>
        </SettingsForm>
      </div>
    </>
  );
}
