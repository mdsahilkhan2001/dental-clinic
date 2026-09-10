import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f2544 0%, #16305a 55%, #135652 100%)",
          padding: "72px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 18,
              height: 64,
              background: "#cca35a",
              borderRadius: 999,
            }}
          />
          <div
            style={{
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#e6d1a9",
            }}
          >
            Jeevan Dental &amp; Aesthetic Clinic
          </div>
        </div>
        <div style={{ fontSize: 68, lineHeight: 1.1, maxWidth: 900, fontWeight: 600 }}>
          Complete Care for Your Smile, Skin &amp; Hair
        </div>
        <div style={{ fontSize: 30, color: "#adc4dc" }}>
          Mahuadanr, Latehar, Jharkhand · +91 94307 40698
        </div>
      </div>
    ),
    size,
  );
}
