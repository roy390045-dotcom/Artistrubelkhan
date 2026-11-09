#!/usr/bin/env node
/**
 * Pre-generates every image variant the site serves, so the production server never
 * resizes images at request time (it runs on a low-end VPS behind Cloudflare).
 *
 *   node scripts/build-images.mjs
 *
 * Reads the largest source file per image id from assets-src/img (photo-<id>[-<w>].jpg),
 * writes public/art/<id>-<w>.avif|webp for each width in WIDTHS (never upscaled), and
 * writes src/data/images.generated.json with width, height, blur placeholder and
 * dominant colour per id. In production the FastAPI upload pipeline does the same
 * with pyvips and stores the result in R2; this script is the local stand-in.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "assets-src", "img");
const OUT = path.join(ROOT, "public", "art");
const MANIFEST = path.join(ROOT, "src", "data", "images.generated.json");

/** Must match images.deviceSizes + imageSizes in next.config.ts. */
export const WIDTHS = [384, 640, 828, 1200, 1600];

const files = (await fs.readdir(SRC)).filter((f) => /^photo-.+\.jpe?g$/i.test(f));
const byId = new Map();
for (const f of files) {
  const m = f.match(/^photo-(.+?)(?:-(\d+))?\.jpe?g$/i);
  if (!m) continue;
  const [, id] = m;
  const meta = await sharp(path.join(SRC, f)).metadata();
  const prev = byId.get(id);
  if (!prev || meta.width > prev.width) byId.set(id, { file: f, width: meta.width });
}

await fs.mkdir(OUT, { recursive: true });
const manifest = {};

/** Licence data for stand-in images (written by the taste-skill photo fetcher). */
const credits = new Map();
try {
  const raw = JSON.parse(await fs.readFile(path.join(SRC, "credits.json"), "utf8"));
  for (const p of raw.photos ?? []) {
    credits.set(p.id, { by: p.by, licence: p.licence, licenceUrl: p.licenceUrl, page: p.page, title: p.alt });
  }
} catch {
  /* no credits file: the client's own photographs need none */
}

for (const [id, { file }] of [...byId].sort()) {
  const input = sharp(path.join(SRC, file)).rotate();
  const { width, height } = await input.metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.includes(width) && width < WIDTHS.at(-1)) widths.push(width);

  for (const w of widths) {
    const base = input.clone().resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 42, effort: 5 }).toFile(path.join(OUT, `${id}-${w}.avif`));
    await base.clone().webp({ quality: 62, smartSubsample: true }).toFile(path.join(OUT, `${id}-${w}.webp`));
  }

  const tiny = await input.clone().resize(16).webp({ quality: 40 }).toBuffer();
  const { dominant } = await input.clone().stats();
  const hex = `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  manifest[id] = {
    width,
    height,
    widths: widths.sort((a, b) => a - b),
    blur: `data:image/webp;base64,${tiny.toString("base64")}`,
    color: hex,
    ...(credits.has(id) ? { credit: credits.get(id) } : {}),
  };
  console.log(`${id}  ${width}x${height}  -> ${widths.join(", ")}`);
}

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`\nwrote ${Object.keys(manifest).length} images to public/art and ${path.relative(ROOT, MANIFEST)}`);
