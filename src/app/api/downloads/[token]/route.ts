import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

const BOOK_FILES_BUCKET = "book-files";
const SIGNED_URL_TTL_SECONDS = 60;

function errorPage(status: number, message: string) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family:sans-serif;text-align:center;padding:4rem 1rem;">
      <h1>${message}</h1>
      <p><a href="/account/orders">Back to your orders</a></p>
    </body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return errorPage(500, "Downloads are temporarily unavailable.");
  }

  const { data: download, error } = await admin
    .from("digital_downloads")
    .select("id, storage_path, expires_at, max_downloads, download_count")
    .eq("download_token", token)
    .maybeSingle();

  if (error || !download) {
    return errorPage(404, "This download link is not valid.");
  }

  if (new Date(download.expires_at) < new Date()) {
    return errorPage(410, "This download link has expired.");
  }

  if (download.download_count >= download.max_downloads) {
    return errorPage(410, "This download link has reached its download limit.");
  }

  const { data: signed, error: signError } = await admin.storage
    .from(BOOK_FILES_BUCKET)
    .createSignedUrl(download.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed) {
    logger.error("Failed to create signed download URL", { error: signError });
    return errorPage(500, "This file could not be prepared for download. Please try again shortly.");
  }

  await admin
    .from("digital_downloads")
    .update({
      download_count: download.download_count + 1,
      last_downloaded_at: new Date().toISOString(),
    })
    .eq("id", download.id);

  return NextResponse.redirect(signed.signedUrl);
}
