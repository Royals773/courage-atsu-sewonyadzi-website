"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileAudio, FileText, Film, FolderPlus, Image as ImageIcon, Trash2, Upload } from "lucide-react";

import {
  createMediaFolderAction,
  deleteMediaFolderAction,
  deleteMediaItemAction,
  setMediaKitCategoryAction,
  uploadMediaItemAction,
} from "@/lib/admin/media/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MediaFolder {
  id: string;
  name: string;
}

interface MediaItem {
  id: string;
  file_name: string;
  file_type: string;
  size_bytes: number;
  storage_path: string;
  kit_category: string | null;
}

const KIT_CATEGORIES = [
  { value: "", label: "Not in media kit" },
  { value: "headshot", label: "Headshot" },
  { value: "logo", label: "Logo" },
  { value: "event-photo", label: "Event photo" },
  { value: "book-cover", label: "Book cover" },
  { value: "other", label: "Other" },
];

const FILE_ICONS: Record<string, React.ElementType> = {
  image: ImageIcon,
  pdf: FileText,
  epub: FileText,
  video: Film,
  audio: FileAudio,
  other: FileText,
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryView({
  folders,
  items,
  activeFolderId,
}: {
  folders: MediaFolder[];
  items: MediaItem[];
  activeFolderId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectFolder(folderId: string | null) {
    router.push(folderId ? `/admin/media?folder=${folderId}` : "/admin/media");
  }

  function handleUpload(formData: FormData) {
    if (activeFolderId) formData.set("folder_id", activeFolderId);
    startTransition(async () => {
      try {
        await uploadMediaItemAction(formData);
        toast.success("File uploaded");
      } catch (error) {
        toast.error("Upload failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleCreateFolder(formData: FormData) {
    startTransition(async () => {
      try {
        await createMediaFolderAction(formData);
        toast.success("Folder created");
      } catch (error) {
        toast.error("Couldn't create folder", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleDeleteItem(itemId: string) {
    startTransition(async () => {
      try {
        await deleteMediaItemAction(itemId);
      } catch (error) {
        toast.error("Couldn't delete file", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleSetKitCategory(itemId: string, kitCategory: string) {
    startTransition(async () => {
      try {
        await setMediaKitCategoryAction(itemId, kitCategory || null);
        toast.success("Media kit tag updated");
      } catch (error) {
        toast.error("Couldn't update media kit tag", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleDeleteFolder(folderId: string) {
    startTransition(async () => {
      try {
        await deleteMediaFolderAction(folderId);
        if (activeFolderId === folderId) selectFolder(null);
      } catch (error) {
        toast.error("Couldn't delete folder", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Folders</p>
        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => selectFolder(null)}
            className={cn(
              "rounded-md px-3 py-1.5 text-left text-sm",
              !activeFolderId ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
          >
            All files
          </button>
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => selectFolder(folder.id)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-left text-sm",
                  activeFolderId === folder.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                {folder.name}
              </button>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                onClick={() => handleDeleteFolder(folder.id)}
                aria-label={`Delete folder ${folder.name}`}
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <form action={handleCreateFolder} className="mt-4 flex gap-2">
          <Input name="name" placeholder="New folder" className="h-8 text-sm" />
          <Button type="submit" size="icon-sm" variant="outline" aria-label="Create folder">
            <FolderPlus className="size-3.5" aria-hidden="true" />
          </Button>
        </form>
      </div>

      <div>
        <form action={handleUpload} className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Alt text (images)</label>
            <input
              name="alt_text"
              className="mt-1 block h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            />
          </div>
          <input type="file" name="file" required className="text-xs" />
          <Button type="submit" size="sm" disabled={isPending}>
            <Upload className="size-3.5" aria-hidden="true" />
            Upload
          </Button>
        </form>

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No files in this folder yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => {
              const Icon = FILE_ICONS[item.file_type] ?? FileText;
              return (
                <Card key={item.id}>
                  <CardContent className="flex flex-col items-center gap-2 p-3 text-center">
                    <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
                    <p className="w-full truncate text-xs font-medium" title={item.file_name}>
                      {item.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatBytes(item.size_bytes)}</p>
                    {item.file_type === "image" ? (
                      <select
                        defaultValue={item.kit_category ?? ""}
                        disabled={isPending}
                        onChange={(e) => handleSetKitCategory(item.id, e.target.value)}
                        className="w-full rounded-md border border-input bg-transparent px-1.5 py-1 text-xs"
                      >
                        {KIT_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
