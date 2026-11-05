"use client";

import { useEffect, useRef, useState } from "react";

// Muted, looping demo video. People who ask for reduced motion get a paused
// poster with native controls instead of autoplay.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  // The files load after the page itself, so the poster paints first and the
  // 1 MB video does not compete with it.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const go = () => setReady(true);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      const video = ref.current;
      if (!video) return;
      if (mq.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [ready]);

  return (
    <video
      ref={ref}
      className="size-full object-cover"
      poster="/video/hero-poster.webp"
      aria-label="Pluckr extracting the images of a Google Doc"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      controls={reduced}
      disablePictureInPicture
    >
      {ready && (
        <>
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </>
      )}
      <track
        kind="captions"
        src="/video/hero.vtt"
        srcLang="en"
        label="English"
        default
      />
    </video>
  );
}
