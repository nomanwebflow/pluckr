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
    <>
      {/* Real image under the video so the browser fetches it at high priority
        and picks a size for the screen. The video fades in over it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/video/hero-poster.webp"
        srcSet="/video/hero-poster-640.webp 640w, /video/hero-poster.webp 1312w"
        sizes="(max-width: 1376px) 100vw, 1312px"
        alt=""
        width={1312}
        height={738}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      <video
        ref={ref}
        className="relative size-full object-cover"
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
    </>
  );
}
