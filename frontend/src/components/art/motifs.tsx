/**
 * Small hand-drawn botanical motifs that grow along the brush strokes: flowers, buds, leaf
 * sprigs, a curling vine and a little tree. Plain inline SVG, decorative only (aria-hidden),
 * coloured by props so the stroke's pigments carry into the flowers.
 */
import type { CSSProperties } from "react";

export const pigments = {
  magenta: "#d4246e",
  red: "#e0352a",
  orange: "#f08a1c",
  leaf: "#3d7a4c",
  leafLight: "#6aa05a",
  centre: "#f6c445",
} as const;

export type MotifKind = "flower" | "bud" | "sprig" | "vine" | "tree" | "daisy";

interface MotifProps {
  kind: MotifKind;
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function Motif({ kind, color = pigments.magenta, size = 34, className = "", style }: MotifProps) {
  const common = { width: size, height: size, className, style, "aria-hidden": true as const, focusable: "false" as const };
  switch (kind) {
    case "flower":
      return (
        <svg viewBox="-20 -20 40 40" {...common}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-9" rx="6.5" ry="9.5" fill={color} transform={`rotate(${r})`} opacity="0.92" />
          ))}
          <circle r="4.6" fill={pigments.centre} />
          <circle r="1.8" fill="#8a4b12" />
        </svg>
      );
    case "daisy":
      return (
        <svg viewBox="-20 -20 40 40" {...common}>
          {Array.from({ length: 10 }, (_, i) => i * 36).map((r) => (
            <ellipse key={r} cx="0" cy="-10" rx="3.2" ry="8" fill={color} transform={`rotate(${r})`} />
          ))}
          <circle r="4.2" fill={pigments.centre} />
        </svg>
      );
    case "bud":
      return (
        <svg viewBox="-20 -20 40 40" {...common}>
          <path d="M0 18 C 1 8, -1 2, 0 -2" stroke={pigments.leaf} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M0 4 C -8 2, -10 -4, -9 -8 C -4 -6, -1 -2, 0 4 Z" fill={pigments.leafLight} />
          <path d="M0 -2 C -7 -6, -5 -16, 0 -18 C 5 -16, 7 -6, 0 -2 Z" fill={color} />
        </svg>
      );
    case "sprig":
      return (
        <svg viewBox="-20 -20 40 40" {...common}>
          <path d="M-14 16 C -6 6, 2 -2, 14 -16" stroke={pigments.leaf} strokeWidth="2" fill="none" strokeLinecap="round" />
          {[
            [-8, 8, -35],
            [-2, 2, 30],
            [4, -5, -40],
            [9, -11, 25],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3.4" ry="7.5" fill={i % 2 ? pigments.leaf : pigments.leafLight} transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </svg>
      );
    case "vine":
      return (
        <svg viewBox="-24 -24 48 48" {...common}>
          <path
            d="M-20 20 C -6 14, -12 -2, 0 -4 C 10 -6, 10 6, 2 6 C -4 6, -3 -2, 3 -1"
            stroke={pigments.leaf}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="-10" cy="10" rx="3.2" ry="6.5" fill={pigments.leafLight} transform="rotate(-50 -10 10)" />
          <ellipse cx="-8" cy="-4" rx="3" ry="6" fill={pigments.leaf} transform="rotate(30 -8 -4)" />
          <circle cx="14" cy="-14" r="4.5" fill={color} />
          <circle cx="14" cy="-14" r="1.6" fill={pigments.centre} />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="-20 -20 40 40" {...common}>
          <path d="M0 18 L0 2 M0 8 L-5 3 M0 6 L5 1" stroke="#6b4a2b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="0" cy="-6" r="10" fill={pigments.leaf} />
          <circle cx="-7" cy="-1" r="6.5" fill={pigments.leafLight} />
          <circle cx="7" cy="-2" r="6" fill={pigments.leafLight} />
          <circle cx="3" cy="-11" r="2" fill={color} />
          <circle cx="-4" cy="-6" r="1.7" fill={color} />
        </svg>
      );
  }
}
