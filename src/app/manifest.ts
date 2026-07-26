import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/content/site-config";
import { getSettingGroup } from "@/lib/settings/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const brand = await getSettingGroup("brand");

  return {
    name: brand.fullName,
    short_name: brand.initials,
    description: brand.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fcfaf6",
    theme_color: "#131f35",
    icons: [
      {
        src: siteConfig.assets.icon,
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: siteConfig.assets.appleTouchIcon,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
