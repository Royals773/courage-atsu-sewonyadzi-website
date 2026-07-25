import type { LegalPage } from "./types";

const disclaimer: LegalPage["sections"][number] = {
  heading: "A note on this page",
  body: [
    "This page is a structural placeholder. The wording below is generic and must be reviewed and finalised by a qualified legal professional before this site goes live — it does not constitute legal advice or a compliant policy.",
  ],
};

function page(slug: string, title: string): LegalPage {
  return {
    slug,
    title,
    sections: [
      disclaimer,
      {
        heading: "Overview",
        body: [
          `[Placeholder content for the ${title}. Replace this section with reviewed legal wording appropriate to your business, products and jurisdictions (UK, Ghana, and international visitors).]`,
        ],
      },
    ],
  };
}

export const legalPages: LegalPage[] = [
  page("privacy-policy", "Privacy Policy"),
  page("cookie-policy", "Cookie Policy"),
  page("terms-conditions", "Terms and Conditions"),
  page("book-sales-terms", "Book Sales Terms"),
  page("digital-product-terms", "Digital Product Terms"),
  page("refund-returns-policy", "Refund and Returns Policy"),
  page("shipping-policy", "Shipping Policy"),
  page("disclaimer", "Website Disclaimer"),
  page("accessibility-statement", "Accessibility Statement"),
];

export function getLegalPageBySlug(slug: string): LegalPage | undefined {
  return legalPages.find((p) => p.slug === slug);
}
