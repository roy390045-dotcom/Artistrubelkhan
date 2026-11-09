"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Dealt moment "picture-develops", film look (taste-skill assets/moments/picture-develops):
 * the painting comes up out of the paper like a print in the developer tray, pale and grey
 * first, its darks before its light tones, then its colour, settling from a slight zoom.
 * About 1.6 s, once, transform + filter on the one image. Reduced motion, no script or a
 * failed observer: the painting simply stands.
 */
export function PictureDevelops({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const img = root?.querySelector("img");
    if (!root || !img) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    let done = false;
    let anim: Animation | null = null;
    const finish = () => {
      done = true;
      root.classList.remove("is-armed");
      root.classList.add("is-done");
    };
    const arm = () => !done && root.classList.add("is-armed");

    const run = async () => {
      if (done) return;
      arm();
      if (!img.complete) {
        await new Promise((r) => {
          img.addEventListener("load", r, { once: true });
          img.addEventListener("error", r, { once: true });
        });
      }
      anim = img.animate(
        [
          { filter: "grayscale(1) contrast(.55) brightness(1.32)", transform: "scale(1.06)" },
          { filter: "grayscale(.8) contrast(.82) brightness(1.14)", offset: 0.3 },
          { filter: "grayscale(.35) contrast(.95) brightness(1.04)", offset: 0.62 },
          { filter: "grayscale(0) contrast(1) brightness(1)", transform: "none" },
        ],
        { duration: 1600, easing: "cubic-bezier(.3,.2,.3,1)", fill: "both" },
      );
      root.classList.remove("is-armed");
      anim.finished.then(finish, finish);
    };

    const r0 = root.getBoundingClientRect();
    // Already on screen at load (a deep link, a reload mid-page): it stands, no develop.
    if (r0.top < innerHeight && r0.bottom > 0) return;

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          arm();
          near.disconnect();
        }
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    const seen = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          seen.disconnect();
          run();
        }
      },
      { threshold: Math.min(0.25, (0.4 * innerHeight) / Math.max(1, r0.height)) },
    );
    near.observe(root);
    seen.observe(root);
    return () => {
      near.disconnect();
      seen.disconnect();
      anim?.cancel();
    };
  }, []);

  return (
    <div ref={ref} data-moment="picture-develops" className={`moment-develops ${className}`}>
      {children}
    </div>
  );
}
