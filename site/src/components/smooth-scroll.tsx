"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Lenis smooth scrolling on the page. Skipped for people who ask for
// reduced motion, who keep native scrolling.
export function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled ? <ReactLenis root options={{ lerp: 0.1 }} /> : null;
}
