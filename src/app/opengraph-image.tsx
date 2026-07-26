import { ImageResponse } from "next/og";

import { getSettingGroup } from "@/lib/settings/queries";

export const alt = "Courage Atsu Sewonyadzi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default, sitewide social share image — used by any page that doesn't
 * set its own `openGraph.images` (see src/lib/seo.ts's `buildMetadata`,
 * used by book/insight/speaking-topic pages, which pass their own image
 * and take precedence over this default).
 */
export default async function OpengraphImage() {
  const brand = await getSettingGroup("brand");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#131f35",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            width: 100,
            height: 100,
            borderTop: "6px solid #dbb155",
            borderLeft: "6px solid #dbb155",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 60,
            width: 100,
            height: 100,
            borderBottom: "6px solid #dbb155",
            borderRight: "6px solid #dbb155",
            opacity: 0.85,
          }}
        />
        <div
          style={{
            fontSize: 68,
            fontWeight: 600,
            color: "#fcfaf6",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          {brand.displayName}
        </div>
        <div style={{ width: 440, height: 2, backgroundColor: "#dbb155", marginTop: 32, marginBottom: 28 }} />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 3,
            color: "#dbb155",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {brand.positioningStatement}
        </div>
      </div>
    ),
    { ...size }
  );
}
