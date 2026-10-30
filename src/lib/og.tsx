import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

import { ogSize } from "@/lib/og-meta";

export { ogAlt, ogSize } from "@/lib/og-meta";

/** Shared social share card (Open Graph + Twitter), generated from site.config.ts */
export function renderOgImage() {
  const { brand, address, hero } = siteConfig;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0F766E 0%, #115E59 55%, #134E4A 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#FFFFFF",
              color: "#0F766E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {brand.shortName.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{brand.shortName}</div>
            <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.8 }}>
              {brand.logoSubtitle}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>
            {`${hero.headingStart} ${hero.headingHighlight}`}
          </div>
          <div style={{ fontSize: 30, opacity: 0.9, maxWidth: 980, lineHeight: 1.35 }}>{brand.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, opacity: 0.9 }}>
          <div>{`Physiotherapy · ${address.city}`}</div>
          <div
            style={{
              display: "flex",
              background: "#EA580C",
              padding: "10px 24px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Request an appointment
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
