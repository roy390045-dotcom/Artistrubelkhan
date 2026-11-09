import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ImageAsset } from "./types";

export const ogSize = { width: 1200, height: 630 };

async function dataUrl(image: ImageAsset) {
  const buf = await readFile(join(process.cwd(), "public", "art", `${image.id}-og.jpg`));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/**
 * The shared 1200x630 card for Facebook, WhatsApp, LinkedIn, X and Pinterest: the painting
 * whole on the stone ground at the left, the words at the right.
 */
export async function artCard({ image, eyebrow, title, lines }: { image: ImageAsset; eyebrow: string; title: string; lines: string[] }) {
  const src = await dataUrl(image);
  const boxW = 640;
  const boxH = 530;
  const scale = Math.min(boxW / image.width, boxH / image.height);
  const w = Math.round(image.width * scale);
  const h = Math.round(image.height * scale);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#e8e8e3", color: "#181715", padding: 50, gap: 48 }}>
        <div style={{ width: boxW, height: boxH, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={w} height={h} alt="" style={{ boxShadow: "0 18px 36px -20px rgba(24,23,21,0.55)" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 7, background: "#181715", color: "#f3f3ef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              R
            </div>
            <div style={{ fontSize: 26 }}>Rubel Khan</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 22, color: "#5c5b56" }}>{eyebrow}</div>
            <div style={{ fontSize: 50, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
            {lines.map((l) => (
              <div key={l} style={{ fontSize: 24, color: "#5c5b56" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
