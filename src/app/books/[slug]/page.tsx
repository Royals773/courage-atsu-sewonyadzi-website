import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { books, getBookBySlug } from "@/lib/content/books";
import { faqs } from "@/lib/content/faqs";
import { testimonials } from "@/lib/content/testimonials";
import { siteConfig } from "@/lib/content/site-config";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { BookCard } from "@/components/shared/book-card";
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
}

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const relatedBooks = books.filter((b) => b.id !== book.id).slice(0, 2);
  const bookFaqs = faqs.filter((f) =>
    ["book-orders", "delivery", "digital-downloads", "refunds"].includes(
      f.category
    )
  );
  const endorsements = testimonials.filter((t) => t.category === "book-review");
  const shareUrl = `${siteConfig.siteUrl}/books/${book.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <div>
          <ImagePlaceholder label={book.coverImageLabel} aspect="portrait" />
          <ShareLinks url={shareUrl} title={book.title} className="mt-6 flex flex-wrap gap-2" />
        </div>

        <div>
          {book.isNew ? <Badge className="mb-3">New</Badge> : null}
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{book.subtitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            By {siteConfig.brandName}
          </p>

          <p className="mt-6 text-pretty text-foreground/90">
            {book.description}
          </p>

          <Separator className="my-6" />

          <div className="space-y-3">
            <p className="text-sm font-semibold">Available formats</p>
            {book.formats.map((format) => (
              <div
                key={format.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{format.label}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {format.stockStatus.replace("-", " ")}
                  </p>
                </div>
                <p className="font-heading text-base font-semibold">
                  {formatPrice(format.price)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled title="Basket arrives in Phase 2">
              Add to Basket
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              disabled
              title="Checkout arrives in Phase 2"
            >
              Buy Now
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Basket and checkout go live in Phase 2 — quantity selection and
            purchasing will be enabled then.
          </p>

          {book.hasSampleChapter ? (
            <Button variant="link" className="mt-4 h-auto p-0" disabled>
              Download sample chapter (available in Phase 2)
            </Button>
          ) : null}
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
