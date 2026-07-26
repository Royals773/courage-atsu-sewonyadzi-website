export function getEmbedUrl(platform: "youtube" | "vimeo", url: string | null): string | null {
  if (!url) return null;

  if (platform === "youtube") {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  if (platform === "vimeo") {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : url;
  }

  return url;
}
