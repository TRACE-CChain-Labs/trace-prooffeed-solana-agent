"use client";

export default function HeroVideoFallback() {
  return (
    <div className="absolute inset-0">
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.34),transparent_54%),radial-gradient(circle_at_82%_78%,rgba(56,189,248,0.28),transparent_58%),linear-gradient(165deg,rgba(6,7,12,0.34),rgba(6,7,12,0.85))]" />
    </div>
  );
}
