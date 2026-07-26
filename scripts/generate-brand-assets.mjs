#!/usr/bin/env node
// Rasterises PNG brand assets from the approved SVG sources in
// public/brand/. Re-run this whenever those SVGs change.
//
// Uses `sharp` (already present as a Next.js transitive dependency — no
// new package dependency added for this).
//
// Usage: node scripts/generate-brand-assets.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "..", "public", "brand");

const NAVY = "#131f35";
const GOLD = "#dbb155";
const WARM_WHITE = "#fcfaf6";

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <path d="M60 160 V60 H160" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="square" opacity="0.85"/>
  <path d="M1040 570 H1140 V470" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="square" opacity="0.85"/>
  <text x="600" y="300" text-anchor="middle" font-family="Fraunces, Georgia, 'Times New Roman', serif" font-size="72" font-weight="600" letter-spacing="0.5" fill="${WARM_WHITE}">Courage Atsu Sewonyadzi</text>
  <line x1="380" y1="345" x2="820" y2="345" stroke="${GOLD}" stroke-width="2"/>
  <text x="600" y="392" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="3" fill="${GOLD}">AUTHOR &#183; KEYNOTE SPEAKER</text>
  <text x="600" y="428" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="3" fill="${GOLD}">ADULT SOCIAL CARE STRATEGIST &#183; ENTREPRENEUR</text>
</svg>
`;

async function main() {
  await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toFile(path.join(brandDir, "og-default.png"));
  console.log("Wrote public/brand/og-default.png (1200x630)");

  const iconSvg = readFileSync(path.join(brandDir, "icon.svg"));
  await sharp(iconSvg).resize(180, 180).png().toFile(path.join(brandDir, "apple-touch-icon.png"));
  console.log("Wrote public/brand/apple-touch-icon.png (180x180)");
}

main().catch((error) => {
  console.error("generate-brand-assets failed:", error);
  process.exit(1);
});
