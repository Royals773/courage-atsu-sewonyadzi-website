import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getMediaFolders, getMediaItems } from "@/lib/admin/media/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaLibraryView } from "@/components/admin/media/media-library-view";

export const metadata: Metadata = { title: "Media Library" };

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  await requireAdmin("editor");
  const { folder } = await searchParams;
  const activeFolderId = folder ?? null;

  const [folders, items] = await Promise.all([getMediaFolders(), getMediaItems(activeFolderId)]);

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Images, PDFs, ePub, video and audio files used across the site."
      />
      <MediaLibraryView folders={folders} items={items} activeFolderId={activeFolderId} />
    </>
  );
}
