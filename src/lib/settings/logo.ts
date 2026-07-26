import "server-only";

import { getMediaSignedUrl } from "@/lib/media/signed-url";

export async function getLogoUrl(logoPath: string): Promise<string | null> {
  return getMediaSignedUrl(logoPath);
}

export async function getAuthorPhotoUrl(photoPath: string): Promise<string | null> {
  return getMediaSignedUrl(photoPath);
}
