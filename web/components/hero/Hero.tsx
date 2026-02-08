"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HeroVideoFallback from "./HeroVideoFallback";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
});

function bindMediaListener(mql: MediaQueryList, callback: () => void) {
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  }

  mql.addListener(callback);
  return () => mql.removeListener(callback);
}

export default function Hero() {
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 900px)");

    const onChange = () => {
      setUseFallback(reducedMotion.matches || smallScreen.matches);
    };

    onChange();
    const cleanups = [
      bindMediaListener(reducedMotion, onChange),
      bindMediaListener(smallScreen, onChange),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section className="mt-10 relative min-h-[360px] overflow-hidden rounded-[30px] border border-white/10 bg-[#050912] shadow-soft sm:min-h-[440px]">
      {useFallback ? <HeroVideoFallback /> : <HeroScene />}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,12,0.10),rgba(6,7,12,0.52)_58%,rgba(6,7,12,0.78))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.09] bg-[linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:84px_84px]" />

      <div className="relative z-10 flex min-h-[360px] items-end p-7 sm:min-h-[440px] sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">TRACE ProofFeed</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Verifiable Agent Reasoning
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Commit, Reveal, and Verify on Solana devnet with a public verification surface.
          </p>
        </div>
      </div>
    </section>
  );
}
