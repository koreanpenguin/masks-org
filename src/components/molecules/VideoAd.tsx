"use client";
import { useRef } from "react";

export function VideoAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl bg-[#2d2926] aspect-video shadow-xl"
    >
      <video
        src="/ad.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        title="Fullscreen"
        className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );
}
