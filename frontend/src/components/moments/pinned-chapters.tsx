"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface Chapter {
  title: string;
  body: string;
  visual: ReactNode;
}

/**
 * Dealt moment "pinned-chapters" (taste-skill assets/moments/pinned-chapters): the section
 * holds on screen for one screen of native scroll while its steps open one at a time and
 * the one frame on the right crossfades to each step's picture. Live only from 1024px wide
 * on a screen 640px tall or more, without reduced motion; otherwise a static row per step.
 */
export function PinnedChapters({ heading, intro, chapters }: { heading: ReactNode; intro?: ReactNode; chapters: Chapter[] }) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const mqWide = matchMedia("(min-width: 1024px) and (min-height: 640px)");
    const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLive(mqWide.matches && !mqReduce.matches);
    sync();
    mqWide.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    return () => {
      mqWide.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!live) return;
    const root = ref.current;
    if (!root) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect();
        const travel = Math.max(1, r.height - innerHeight);
        const p = Math.min(1, Math.max(0, -r.top / travel));
        setStep(Math.min(chapters.length - 1, Math.floor(p * chapters.length)));
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [live, chapters.length]);

  return (
    <section ref={ref} data-moment="pinned-chapters" className={`pc ${live ? "is-live" : ""}`} aria-labelledby="pc-h">
      <div className="pc__grid wrap">
        <div className="pc__text">
          <div className="grid gap-4">
            <h2 id="pc-h" className="t-h2">
              {heading}
            </h2>
            {intro && <p className="t-lead measure text-muted">{intro}</p>}
          </div>
          <ol className="pc__steps">
            {chapters.map((c, i) => (
              <li key={c.title} className={`pc__step ${live && i === step ? "is-on" : ""}`}>
                <h3>{c.title}</h3>
                <p>
                  <span className="pc__p-in">{c.body}</span>
                </p>
                {!live && <div className="pc__visual">{c.visual}</div>}
              </li>
            ))}
          </ol>
        </div>
        {live && (
          <div className="pc__visuals" aria-hidden="true">
            {chapters.map((c, i) => (
              <div key={c.title} className={`pc__visual ${i === step ? "is-on" : ""} ${i < step ? "is-past" : ""}`}>
                {c.visual}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
