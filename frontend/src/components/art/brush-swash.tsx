import type { CSSProperties } from "react";
import { Motif, pigments, type MotifKind } from "./motifs";
import { smoothPath, type Pt } from "./path";

/*
  A crooked brush stroke that runs crossways behind an image on inner pages, with vines and
  flowers growing from both ends. Place it inside a `relative isolate` parent, before the image.
  trigger="load" paints it in once on page load (for images above the fold); trigger="scroll"
  paints it as it scrolls into view (CSS view timeline). Decorative only.
*/

const VARIANTS: Record<"rise" | "fall" | "wave", readonly Pt[]> = {
  rise: [
    [-2, 86],
    [18, 74],
    [38, 70],
    [58, 46],
    [80, 30],
    [102, 14],
  ],
  fall: [
    [-2, 16],
    [20, 28],
    [42, 26],
    [62, 52],
    [82, 66],
    [102, 84],
  ],
  wave: [
    [-2, 62],
    [22, 40],
    [46, 64],
    [70, 36],
    [102, 54],
  ],
};

const ENDS: Record<keyof typeof VARIANTS, { start: { kind: MotifKind; dx: number; dy: number; color?: string; size?: number }[]; end: typeof ENDS.rise.start }> = {
  rise: {
    start: [
      { kind: "vine", dx: 0, dy: -6, color: pigments.magenta, size: 46 },
      { kind: "flower", dx: 8, dy: 6, color: pigments.orange, size: 34 },
    ],
    end: [
      { kind: "flower", dx: -6, dy: 2, color: pigments.magenta, size: 40 },
      { kind: "sprig", dx: -10, dy: 12 },
      { kind: "daisy", dx: -2, dy: -10, color: pigments.red, size: 28 },
    ],
  },
  fall: {
    start: [
      { kind: "sprig", dx: 2, dy: 10 },
      { kind: "daisy", dx: 8, dy: -6, color: pigments.orange, size: 30 },
    ],
    end: [
      { kind: "vine", dx: -6, dy: -8, color: pigments.red, size: 46 },
      { kind: "flower", dx: -12, dy: 6, color: pigments.magenta, size: 36 },
    ],
  },
  wave: {
    start: [
      { kind: "bud", dx: 4, dy: -8, color: pigments.red },
      { kind: "sprig", dx: 6, dy: 8 },
    ],
    end: [
      { kind: "flower", dx: -8, dy: -4, color: pigments.orange, size: 36 },
      { kind: "tree", dx: -14, dy: 10, color: pigments.magenta, size: 34 },
    ],
  },
};

interface Props {
  variant?: keyof typeof VARIANTS;
  trigger?: "load" | "scroll";
  /** How far the stroke spills past the image edges, in % of the parent. */
  bleed?: number;
  /** Separate side and top/bottom spill; default to bleed and bleed / 2. */
  bleedX?: number;
  bleedY?: number;
  className?: string;
}

export function BrushSwash({ variant = "rise", trigger = "scroll", bleed = 10, bleedX = bleed, bleedY = bleed / 2, className = "" }: Props) {
  const points = VARIANTS[variant];
  const d = smoothPath(points);
  const id = `sw-${variant}`;
  const first = points[0];
  const last = points[points.length - 1];
  const place = (p: Pt, m: (typeof ENDS)["rise"]["start"][number], k: number, isEnd: boolean) => (
    <span
      key={`${isEnd ? "e" : "s"}${k}`}
      className="swash__motif"
      style={
        {
          left: `calc(${Math.min(98, Math.max(2, p[0]))}% + ${m.dx}px)`,
          top: `calc(${p[1]}% + ${m.dy}px)`,
          "--n": k + (isEnd ? 3 : 0),
        } as CSSProperties
      }
    >
      <Motif kind={m.kind} color={m.color} size={m.size} />
    </span>
  );

  return (
    <div
      aria-hidden="true"
      className={`swash swash--${trigger} ${className}`}
      style={{ inset: `-${bleedY}% -${bleedX}%` } as CSSProperties}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={pigments.magenta} />
            <stop offset="0.55" stopColor={pigments.red} />
            <stop offset="1" stopColor={pigments.orange} />
          </linearGradient>
        </defs>
        <path d={d} pathLength={1} className="sw sw--body" stroke={`url(#${id})`} />
        <path d={d} pathLength={1} className="sw sw--bristle sw--b1" stroke={`url(#${id})`} transform="translate(0 -3.2)" />
        <path d={d} pathLength={1} className="sw sw--bristle sw--b2" stroke={`url(#${id})`} transform="translate(0 3.6)" />
      </svg>
      {ENDS[variant].start.map((m, k) => place(first, m, k, false))}
      {ENDS[variant].end.map((m, k) => place(last, m, k, true))}
    </div>
  );
}
