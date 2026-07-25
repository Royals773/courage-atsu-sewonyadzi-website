import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { legalPages, getLegalPageBySlug } from "@/lib/content/legal";
import { PageHeader } from "@/components/shared/page-header";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHeader title={page.title} />
      <div className="mx-auto max-w-2xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
        {page.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-heading text-xl font-semibold">
              {section.heading}
            </h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-3 text-pretty text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
