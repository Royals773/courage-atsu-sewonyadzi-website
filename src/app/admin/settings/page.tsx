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
  saveBrandSettingsAction,
  saveContactSettingsAction,
  saveCredibilitySettingsAction,
  saveHeroSettingsAction,
  saveNewsletterSettingsAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction,
  uploadAuthorPhotoAction,
  uploadFaviconAction,
  uploadLogoAction,
  uploadLogoDarkAction,
  uploadLogoLightAction,
  uploadMonogramAction,
  uploadOgImageAction,
} from "@/lib/admin/settings/actions";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin("administrator");

  const [brand, contact, social, seo, hero, about, credibility, newsletter] = await Promise.all([
    getSettingGroup("brand"),
    getSettingGroup("contact"),
    getSettingGroup("social"),
    getSettingGroup("seo"),
    getSettingGroup("hero"),
    getSettingGroup("about"),
    getSettingGroup("credibility"),
    getSettingGroup("newsletter"),
  ]);

  const timelineText = about.timeline.map((item) => `${item.year} — ${item.label}`).join("\n");

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Brand identity, contact, social, SEO, homepage hero, about page and credibility content."
      />

      <div className="space-y-6">
        <ImageUploadForm
          title="Logo"
          hasImage={Boolean(brand.logoPath)}
          emptyNote="No logo uploaded — the default wordmark (public/brand/logo-horizontal.svg) is shown."
          action={uploadLogoAction}
        />

        <ImageUploadForm
          title="Logo (light version)"
          hasImage={Boolean(brand.logoLightPath)}
          emptyNote="No light-version logo uploaded yet. Prepared for a future dark-background/dark-mode header — replacing it later takes just this upload, no code change."
          action={uploadLogoLightAction}
        />

        <ImageUploadForm
          title="Logo (dark version)"
          hasImage={Boolean(brand.logoDarkPath)}
          emptyNote="No dark-version logo uploaded yet. Prepared for a future light-background context — replacing it later takes just this upload, no code change."
          action={uploadLogoDarkAction}
        />

        <ImageUploadForm
          title="Monogram"
          hasImage={Boolean(brand.monogramPath)}
          emptyNote="No monogram uploaded — the default mark (public/brand/monogram.svg) is used where space is limited."
          action={uploadMonogramAction}
        />

        <ImageUploadForm
          title="Favicon"
          hasImage={Boolean(brand.faviconPath)}
          emptyNote="No custom favicon uploaded — the default browser-tab icon (public/brand/favicon.svg) is used. PNG, WebP or SVG recommended."
          action={uploadFaviconAction}
        />

        <ImageUploadForm
          title="Author photo"
          hasImage={Boolean(brand.authorPhotoPath)}
          emptyNote="No photo uploaded — a placeholder is shown on the homepage, about and speaking pages."
          action={uploadAuthorPhotoAction}
        />

        <ImageUploadForm
          title="Default social share image"
          hasImage={Boolean(brand.ogImagePath)}
          emptyNote="No custom image uploaded — the default branded card (public/brand/og-default.png) is used for link previews."
          action={uploadOgImageAction}
        />

        <SettingsForm title="Brand identity" action={saveBrandSettingsAction}>
          <div className="space-y-4 border-b border-border pb-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Identity</p>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" defaultValue={brand.fullName} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" name="displayName" defaultValue={brand.displayName} className="mt-1.5" />
              <p className="mt-1 text-xs text-muted-foreground">Shown in the header, footer and page titles.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="initials">Initials</Label>
                <Input id="initials" name="initials" defaultValue={brand.initials} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" name="tagline" defaultValue={brand.tagline} className="mt-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">
                  The live tagline shown across the site. Copy one of the alternatives below in to switch it.
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="positioningStatement">Professional positioning statement</Label>
              <Input
                id="positioningStatement"
                name="positioningStatement"
                defaultValue={brand.positioningStatement}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="taglineAlternatives">Alternative taglines (one per line, for reference)</Label>
              <Textarea
                id="taglineAlternatives"
                name="taglineAlternatives"
                defaultValue={brand.taglineAlternatives.join("\n")}
                rows={6}
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Premium alternatives to choose from. Switching the active tagline never requires a code change —
                just paste your preferred line into the Tagline field above and save.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-b border-border py-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Positioning &amp; bio</p>
            <div>
              <Label htmlFor="shortBio">Short bio</Label>
              <Textarea id="shortBio" name="shortBio" defaultValue={brand.shortBio} rows={2} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="longBiography">Long biography</Label>
              <Textarea
                id="longBiography"
                name="longBiography"
                defaultValue={brand.longBiography}
                rows={6}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="mission">Mission</Label>
              <Textarea id="mission" name="mission" defaultValue={brand.mission} rows={2} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="vision">Vision</Label>
              <Textarea id="vision" name="vision" defaultValue={brand.vision} rows={2} className="mt-1.5" />
            </div>
          </div>

          <div className="space-y-4 border-b border-border py-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Contact &amp; legal</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Telephone</Label>
                <Input id="phone" name="phone" defaultValue={brand.phone} placeholder="Not yet provided" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={brand.location}
                  placeholder="Not yet provided"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="emailSenderName">Email sender name</Label>
                <Input id="emailSenderName" name="emailSenderName" defaultValue={brand.emailSenderName} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="copyrightName">Copyright name</Label>
                <Input id="copyrightName" name="copyrightName" defaultValue={brand.copyrightName} className="mt-1.5" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Colours &amp; type</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="primaryColor">Primary colour</Label>
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  defaultValue={brand.primaryColor ?? ""}
                  placeholder="Leave blank for default"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="accentColor">Accent colour</Label>
                <Input
                  id="accentColor"
                  name="accentColor"
                  defaultValue={brand.accentColor ?? ""}
                  placeholder="Leave blank for default"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary accent colour</Label>
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  defaultValue={brand.secondaryColor ?? ""}
                  placeholder="Leave blank for default"
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="headingFont">Heading font</Label>
                <select
                  id="headingFont"
                  name="headingFont"
                  defaultValue={brand.headingFont}
                  className="mt-1.5 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="fraunces">Fraunces (default)</option>
                  <option value="playfair-display">Playfair Display</option>
                </select>
              </div>
              <div>
                <Label htmlFor="bodyFont">Body font</Label>
                <select
                  id="bodyFont"
                  name="bodyFont"
                  defaultValue={brand.bodyFont}
                  className="mt-1.5 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="inter">Inter (default)</option>
                  <option value="source-sans-3">Source Sans 3</option>
                </select>
              </div>
            </div>
          </div>

          <input type="hidden" name="logoPath" value={brand.logoPath ?? ""} />
          <input type="hidden" name="logoLightPath" value={brand.logoLightPath ?? ""} />
          <input type="hidden" name="logoDarkPath" value={brand.logoDarkPath ?? ""} />
          <input type="hidden" name="monogramPath" value={brand.monogramPath ?? ""} />
          <input type="hidden" name="authorPhotoPath" value={brand.authorPhotoPath ?? ""} />
          <input type="hidden" name="ogImagePath" value={brand.ogImagePath ?? ""} />
          <input type="hidden" name="faviconPath" value={brand.faviconPath ?? ""} />
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
            <Label htmlFor="lessonsLearned">Lessons learned</Label>
            <Textarea
              id="lessonsLearned"
              name="lessonsLearned"
              defaultValue={about.lessonsLearned}
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
            <Label htmlFor="awards">Awards (one per line — leave empty until real, verifiable awards exist)</Label>
            <Textarea
              id="awards"
              name="awards"
              defaultValue={about.awards.join("\n")}
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

        <SettingsForm title="Newsletter" action={saveNewsletterSettingsAction}>
          <div>
            <Label htmlFor="newsletterHeadline">Headline</Label>
            <Input id="newsletterHeadline" name="headline" defaultValue={newsletter.headline} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="newsletterDescription">Description</Label>
            <Textarea
              id="newsletterDescription"
              name="description"
              defaultValue={newsletter.description}
              rows={2}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="newsletterConsentText">Consent checkbox text</Label>
            <Textarea
              id="newsletterConsentText"
              name="consentText"
              defaultValue={newsletter.consentText}
              rows={2}
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
