import type { CSSProperties } from "react";
import { Motif, pigments, type MotifKind } from "./motifs";
import { smoothPath, type Pt } from "./path";

/*
  Two thick brush strokes down the left and right edges of the home page, in magenta, red and
  orange. The top of each stroke paints in on load; the rest is drawn by the scroll itself
  (CSS scroll timeline on stroke-dashoffset, no JavaScript), and flowers, leaves, vines and a
  little tree bloom along the stroke's edge as it reaches them. Decorative: aria-hidden, behind
  all content (z-index -1), static and fully drawn under reduced motion or without support.
*/

// The stroke's path in a 100 x 1000 box (stretched to the viewport height).
const POINTS: readonly Pt[] = [
  [52, -10],
  [70, 90],
  [34, 205],
  [62, 330],
  [38, 450],
  [66, 575],
  [34, 700],
  [60, 820],
  [40, 925],
  [54, 1010],
];

// Motifs sit at a stroke point, nudged to one side of the stroke; `at` is how far down the
// page (scroll progress) the stroke reaches them.
const LEFT_MOTIFS: { kind: MotifKind; i: number; dx: number; color?: string; size?: number }[] = [
  { kind: "flower", i: 1, dx: 14, color: pigments.magenta, size: 38 },
  { kind: "sprig", i: 2, dx: -16 },
  { kind: "daisy", i: 3, dx: 14, color: pigments.orange, size: 30 },
  { kind: "tree", i: 4, dx: -16, color: pigments.red, size: 40 },
  { kind: "bud", i: 5, dx: 14, color: pigments.red },
  { kind: "vine", i: 6, dx: -16, color: pigments.magenta, size: 42 },
  { kind: "flower", i: 7, dx: 14, color: pigments.orange, size: 34 },
  { kind: "sprig", i: 8, dx: -16 },
];

const RIGHT_MOTIFS: typeof LEFT_MOTIFS = [
  { kind: "sprig", i: 1, dx: -16 },
  { kind: "flower", i: 2, dx: 14, color: pigments.orange, size: 36 },
  { kind: "vine", i: 3, dx: -16, color: pigments.red, size: 42 },
  { kind: "daisy", i: 4, dx: 14, color: pigments.magenta, size: 30 },
  { kind: "tree", i: 5, dx: -16, color: pigments.orange, size: 40 },
  { kind: "flower", i: 6, dx: 14, color: pigments.magenta, size: 34 },
  { kind: "bud", i: 7, dx: -16, color: pigments.orange },
  { kind: "daisy", i: 8, dx: 14, color: pigments.red, size: 28 },
];

const D = smoothPath(POINTS);

function Edge({ side, motifs, gradientId }: { side: "left" | "right"; motifs: typeof LEFT_MOTIFS; gradientId: string }) {
  return (
    <div className={`brush-edge brush-edge--${side}`} aria-hidden="true">
      <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="brush-edge__svg">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={side === "left" ? pigments.magenta : pigments.orange} />
            <stop offset="0.5" stopColor={pigments.red} />
            <stop offset="1" stopColor={side === "left" ? pigments.orange : pigments.magenta} />
          </linearGradient>
        </defs>
        {/* body of the stroke, then three bristle trails that give it a dry-brush edge */}
        <path d={D} pathLength={1} className="bs bs--body" stroke={`url(#${gradientId})`} />
        <path d={D} pathLength={1} className="bs bs--bristle bs--b1" stroke={`url(#${gradientId})`} transform="translate(-15 0)" />
        <path d={D} pathLength={1} className="bs bs--bristle bs--b2" stroke={`url(#${gradientId})`} transform="translate(16 0)" />
        <path d={D} pathLength={1} className="bs bs--bristle bs--b3" stroke={`url(#${gradientId})`} transform="translate(3 0)" />
        <path d={D} pathLength={1} className="bs bs--sheen" transform="translate(-7 0)" />
      </svg>
      {motifs.map((m, n) => {
        const [x, y] = POINTS[m.i];
        const at = Math.round((y / 1000) * 100);
        return (
          <span
            key={n}
            className={`motif ${at <= 45 ? "motif--load" : ""}`}
            style={{ top: `${y / 10}%`, left: `calc(${x}% + ${m.dx}px)`, "--at": `${at}%`, "--n": n } as CSSProperties}
          >
            <Motif kind={m.kind} color={m.color} size={m.size} />
          </span>
        );
      })}
    </div>
  );
}

export function BrushEdges() {
  return (
    <>
      <Edge side="left" motifs={LEFT_MOTIFS} gradientId="bs-grad-left" />
      <Edge side="right" motifs={RIGHT_MOTIFS} gradientId="bs-grad-right" />
    </>
  );
}
