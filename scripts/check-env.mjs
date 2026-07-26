#!/usr/bin/env node
// Verifies every environment variable this app needs is set, before a
// deploy or a local run against real services. Reads .env.local if present
// (without mutating the real environment) and falls back to whatever is
// already in process.env (e.g. variables injected by Vercel/CI).
//
// Keep this list in sync with src/lib/env.ts (ENV_VAR_SPECS) and
// .env.example — the three are meant to describe the same variables.
//
// Usage: node scripts/check-env.mjs [path-to-env-file]

import { existsSync, readFileSync } from "node:fs";

const ENV_VARS = [
  { key: "NEXT_PUBLIC_SITE_URL", required: true },
  { key: "NEXT_PUBLIC_SUPABASE_URL", required: true },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true },
  { key: "SUPABASE_SERVICE_ROLE_KEY", required: true },
  { key: "STRIPE_SECRET_KEY", required: true },
  { key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: false },
  { key: "STRIPE_WEBHOOK_SECRET", required: true },
  { key: "RESEND_API_KEY", required: true },
  { key: "ADMIN_EMAIL", required: true },
  { key: "FROM_EMAIL", required: true },
];

function parseEnvFile(path) {
  const values = {};
  const text = readFileSync(path, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

const envFilePath = process.argv[2] ?? ".env.local";
const fileValues = existsSync(envFilePath) ? parseEnvFile(envFilePath) : {};

function valueFor(key) {
  return fileValues[key] || process.env[key] || "";
}

console.log(`Checking environment variables (source: ${existsSync(envFilePath) ? envFilePath : "process.env only"})\n`);

let hasMissingRequired = false;
for (const { key, required } of ENV_VARS) {
  const present = Boolean(valueFor(key));
  const status = present ? "OK     " : required ? "MISSING" : "unset  ";
  if (!present && required) hasMissingRequired = true;
  console.log(`  ${status}  ${key}${required ? "" : " (optional)"}`);
}

console.log("");
if (hasMissingRequired) {
  console.error("One or more required environment variables are missing.");
  process.exit(1);
} else {
  console.log("All required environment variables are set.");
}
