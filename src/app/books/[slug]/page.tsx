import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBookBySlug, getPublishedBooks } from "@/lib/books/queries";
import { getFaqs } from "@/lib/faqs/queries";
import { getApprovedTestimonials } from "@/lib/testimonials/queries";
import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";
import { buildMetadata } from "@/lib/seo";
import { BookCard } from "@/components/shared/book-card";
import { BookCoverGallery } from "@/components/books/book-cover-gallery";
import { BookPurchasePanel } from "@/components/books/book-purchase-panel";
import { ShareLinks } from "@/components/shared/share-links";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return {};
  return buildMetadata({
    title: book.title,
    description: book.description || book.subtitle,
    path: `/books/${book.slug}`,
    image: book.coverImageUrl,
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const [allBooks, faqs, testimonials, brand] = await Promise.all([
    getPublishedBooks(),
    getFaqs(),
    getApprovedTestimonials(),
    getSettingGroup("brand"),
  ]);
  const relatedBooks = allBooks.filter((b) => b.id !== book.id).slice(0, 2);
  const bookFaqs = faqs.filter((f) =>
    ["book-orders", "delivery", "digital-downloads", "refunds"].includes(
      f.category
    )
  );
  const endorsements = testimonials.filter((t) => t.category === "books");
  const shareUrl = `${siteConfig.siteUrl}/books/${book.slug}`;

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    author: { "@type": "Person", name: brand.displayName },
    image: book.coverImageUrl ?? undefined,
    datePublished: book.publicationDate || undefined,
    offers: book.formats.map((format) => ({
      "@type": "Offer",
      name: format.label,
      price: format.price,
      priceCurrency: format.currency,
      availability:
        format.stockStatus === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <div>
          <BookCoverGallery
            coverLabel={book.coverImageLabel}
            coverUrl={book.coverImageUrl}
            galleryLabels={book.galleryImageLabels}
            galleryUrls={book.galleryImageUrls}
          />
          <ShareLinks url={shareUrl} title={book.title} className="mt-6 flex flex-wrap gap-2" />
        </div>

        <div>
          {book.isNew ? <Badge className="mb-3 bg-burgundy text-white">New</Badge> : null}
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{book.subtitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            By {brand.displayName}
          </p>

          <p className="mt-6 text-pretty text-foreground/90">
            {book.description}
          </p>

          <Separator className="my-6" />

          <BookPurchasePanel book={book} />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Key lessons</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
            {book.keyLessons.map((lesson) => (
              <li key={lesson}>{lesson}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold">Who it&apos;s for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/90">
            {book.whoItsFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-2xl font-semibold">Table of contents</h2>
        <ol className="mt-4 space-y-2 text-foreground/90">
          {book.tableOfContents.map((entry) => (
            <li key={entry.title}>{entry.title}</li>
          ))}
        </ol>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold">
          Author&apos;s note
        </h2>
        <p className="mt-4 text-pretty text-foreground/90">
          {book.authorNote}
        </p>
      </div>

      {endorsements.length > 0 ? (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold">
            Reviews and endorsements
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {endorsements.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-lg border border-border p-4 text-sm text-foreground/90"
              >
                &ldquo;{t.quote}&rdquo;
                <footer className="mt-2 text-xs text-muted-foreground">
                  {t.authorName}, {t.organisation}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-16">
        <h2 className="font-heading text-2xl font-semibold">
          Shipping and delivery
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          [Placeholder shipping information — replace with confirmed delivery
          timelines and carriers once fulfilment is set up.] Digital
          purchases are delivered via a secure, time-limited download link
          sent by email after payment.
        </p>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold">
          Frequently asked questions
        </h2>
        <Accordion className="mt-4">
          {bookFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {relatedBooks.length > 0 ? (
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-semibold">
            Related books
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {relatedBooks.map((related) => (
              <BookCard key={related.id} book={related} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-16 text-center">
        <Button variant="outline" render={<Link href="/books" />}>
          Back to all books
        </Button>
      </div>
    </div>
  );
}
