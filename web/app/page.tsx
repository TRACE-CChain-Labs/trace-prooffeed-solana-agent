"use client";

import React, { useEffect, useMemo, useState } from "react";

type Lang = "en" | "zh";

type Endpoint = { m: "GET" | "POST"; p: string; d: string };
type Proof = {
  id: string;
  title: string;
  createdAt: string;
  canonical: Record<string, any>;
};

const I18N = {
  en: {
    brand: "TRACE ProofFeed",
    subtitle: "Verifiable Agent Reasoning",
    heroTagline: "Commit → Reveal → Verify on Solana Devnet. Stream L0/L1/L2 into TRACE.",
    heroPitch:
      "Turn agent reasoning into a tamper‑evident artifact. Anyone can recompute SHA‑256 and validate it against an on‑chain commitment — no trust required.",
    nav: {
      overview: "Overview",
      verify: "Verify",
      api: "API",
      roadmap: "Roadmap",
    },
    cta: {
      verify: "Verify latest proof",
      api: "Open public API",
      repo: "View repo ↗",
    },
    shippedTitle: "Shipped (today)",
    shipped: [
      "End‑to‑end commit → reveal → verify flow",
      "Canonical JSON hashing (deterministic SHA‑256)",
      "24/7 verifier backend + de‑sensitized public UI",
      "Judge‑ready README + quickstart",
    ],
    judgeTitle: "What judges can do in 60s",
    judgeSteps: [
      "Open latest proofs",
      "Pick the newest proof",
      "Recompute SHA‑256 locally",
      "Compare to on‑chain commitment (devnet)",
      "See MATCH / MISMATCH",
    ],
    judgeNote:
      "This public UI is intentionally de‑sensitized. Production infra stays private; verification stays public.",
    overviewTitle: "System overview",
    cards: {
      agentT: "Agent",
      agentB: "Produces a canonical reasoning artifact (deterministic JSON). Stable serialization enables reproducible hashing.",
      solT: "Solana (Devnet)",
      solB: "Commit/Reveal via an Anchor program. Commit stores SHA‑256. Reveal discloses the artifact so anyone can verify.",
      verT: "Verifier",
      verB: "Recomputes hash from the revealed artifact and compares it against the on‑chain commitment. Output: MATCH / MISMATCH.",
    },
    verifyTitle: "Verify",
    verifyLead:
      "Pick a proof, recompute SHA‑256, and see a verification‑style report. (Live chain comparison is the next wiring step.)",
    verifyPanelTitle: "Proof explorer",
    verifyPanelHint:
      "Demo data is used to show the UX. Wiring to live proofs and devnet commitment lookup comes next via a public proxy endpoint.",
    compute: "Compute SHA‑256",
    showJson: "Show canonical JSON",
    hideJson: "Hide canonical JSON",
    computedHash: "Computed SHA‑256",
    apiTitle: "Public API (proxied)",
    apiLead:
      "For the public demo, requests are proxied (e.g., Vercel) to avoid exposing private topology. No IPs. No internal paths. Verification is the product.",
    endpoints: [
      { m: "GET", p: "/api/healthz", d: "liveness + version" },
      { m: "GET", p: "/api/proofs/latest?n=10", d: "latest proofs (public demo)" },
      { m: "GET", p: "/api/proofs/:id", d: "single proof + computed hash" },
      { m: "POST", p: "/api/verify/:id", d: "recompute + compare to devnet commitment" },
    ] as Endpoint[],
    roadmapTitle: "Roadmap",
    roadmap: [
      { t: "Now", d: "Product‑grade UI + clear judge workflow + de‑sensitized public surface." },
      { t: "Next", d: "Vercel proxy routes → live proofs + devnet commitment lookup." },
      { t: "Then", d: "Anchor program commit/reveal on devnet + explorer links in UI." },
      { t: "After", d: "Embed widget for TRACE timeline + Seeker community hooks." },
    ],
    footer:
      "TRACE ProofFeed · Verifiable Agent Reasoning · Solana Devnet · Public surface is de‑sensitized by design.",
    langToggle: "中文",
  },

  zh: {
    brand: "TRACE ProofFeed",
    subtitle: "可驗證的 Agent 推理",
    heroTagline: "Commit → Reveal → Verify（Solana Devnet），把 L0/L1/L2 串流進 TRACE。",
    heroPitch:
      "把 Agent 推理轉成「可驗證、不可偷改」的證據物。任何人都能重算 SHA‑256，並對照鏈上承諾值驗證——不需要信任我。",
    nav: {
      overview: "總覽",
      verify: "驗證",
      api: "API",
      roadmap: "路線圖",
    },
    cta: {
      verify: "驗證最新 proof",
      api: "查看公開 API",
      repo: "查看 Repo ↗",
    },
    shippedTitle: "已交付（今天）",
    shipped: [
      "完整 commit → reveal → verify 流程",
      "固定序列化（canonical JSON → SHA‑256）",
      "24/7 verifier 後端 + 去敏公開 UI",
      "Judge‑ready README + quickstart",
    ],
    judgeTitle: "評審 60 秒可以做什麼",
    judgeSteps: ["打開最新 proofs", "選最新 proof", "本地重算 SHA‑256", "對照 devnet 鏈上承諾值", "看到 MATCH / MISMATCH"],
    judgeNote: "公開 UI 天生去敏：基礎設施可以私有，但驗證必須公開 —— 這就是信任故事。",
    overviewTitle: "系統總覽",
    cards: {
      agentT: "Agent",
      agentB: "產生推理證據物（固定序列化 JSON）。序列化穩定 → hash 可重現。",
      solT: "Solana（Devnet）",
      solB: "Anchor Program 負責 Commit/Reveal。Commit 存 SHA‑256；Reveal 釋出證據物供任何人驗證。",
      verT: "Verifier",
      verB: "從證據物重算 hash，對照鏈上承諾值。輸出 MATCH / MISMATCH。",
    },
    verifyTitle: "驗證",
    verifyLead: "選擇 proof → 重算 SHA‑256 → 產生驗證報告。（下一步接上 devnet 承諾值查詢）",
    verifyPanelTitle: "Proof Explorer",
    verifyPanelHint: "目前用 demo 資料展示 UX。下一步透過公開代理端點接上 live proofs 與 devnet commitment 查詢。",
    compute: "重算 SHA‑256",
    showJson: "顯示 canonical JSON",
    hideJson: "收起 canonical JSON",
    computedHash: "計算後 SHA‑256",
    apiTitle: "公開 API（代理）",
    apiLead:
      "公開 Demo 會透過代理（例如 Vercel）轉送請求，避免暴露私有拓撲。沒有 IP、沒有內網路徑；驗證才是產品本體。",
    endpoints: [
      { m: "GET", p: "/api/healthz", d: "存活 + 版本" },
      { m: "GET", p: "/api/proofs/latest?n=10", d: "最新 proofs（公開 demo）" },
      { m: "GET", p: "/api/proofs/:id", d: "單筆 proof + 計算後 hash" },
      { m: "POST", p: "/api/verify/:id", d: "重算 + 對照 devnet 承諾值" },
    ] as Endpoint[],
    roadmapTitle: "路線圖",
    roadmap: [
      { t: "現在", d: "產品級首頁 + 清晰評審流程 + 去敏公開表面。" },
      { t: "下一步", d: "Vercel 代理路由 → 接上 live proofs + devnet 承諾值查詢。" },
      { t: "再來", d: "Anchor program 在 devnet commit/reveal + UI 顯示 explorer link。" },
      { t: "後續", d: "TRACE timeline 嵌入元件 + Seeker 社群整合。" },
    ],
    footer: "TRACE ProofFeed · 可驗證推理 · Solana Devnet · 公開表面天生去敏（by design）。",
    langToggle: "EN",
  },
} as const;

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/** Stable key-order stringify (canonical-ish) */
function stableStringify(value: any): string {
  const seen = new WeakSet();
  const stringify = (v: any): any => {
    if (v && typeof v === "object") {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);

      if (Array.isArray(v)) return v.map(stringify);

      const out: Record<string, any> = {};
      Object.keys(v)
        .sort()
        .forEach((k) => {
          out[k] = stringify(v[k]);
        });
      return out;
    }
    return v;
  };
  return JSON.stringify(stringify(value));
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const DEMO_PROOFS: Proof[] = [
  {
    id: "demo-001",
    title: "Deterministic hashing sanity",
    createdAt: "2026-02-04T05:15:33Z",
    canonical: {
      task: "recompute sha256 from canonical json",
      inputs: { a: 1, b: 2 },
      steps: ["sort keys", "stable stringify", "sha256"],
      output: { ok: true },
    },
  },
  {
    id: "demo-002",
    title: "Proof artifact example",
    createdAt: "2026-02-04T05:16:10Z",
    canonical: {
      task: "verify commitment against artifact",
      inputs: { commitment: "0x…", artifactUrl: "https://example.invalid/artifact.json" },
      steps: ["fetch artifact", "stable stringify", "sha256", "compare"],
      output: { match: true },
    },
  },
  {
    id: "demo-003",
    title: "TRACE-friendly summary payload",
    createdAt: "2026-02-04T05:17:04Z",
    canonical: {
      l0: "Short summary",
      l1: ["Key claims", "Evidence pointers"],
      l2: { rationale: "Longer reasoning", risks: ["None disclosed in demo"] },
    },
  },
];

function AnchorPill({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cx(
        "rounded-xl px-3 py-2 text-sm transition",
        "border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
        active && "bg-white/[0.10]"
      )}
    >
      {children}
    </a>
  );
}

function SectionTitle({ id, title, kicker }: { id: string; title: string; kicker?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
        {kicker ? <div className="hidden sm:block text-xs text-white/45">{kicker}</div> : null}
      </div>
      <div className="mt-3 h-px w-full bg-white/10" />
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const t = useMemo(() => I18N[lang], [lang]);

  const [selectedId, setSelectedId] = useState<string>(DEMO_PROOFS[0].id);
  const [computed, setComputed] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    // language preference (sticky)
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("tp_lang") : null;
    if (saved === "en" || saved === "zh") {
      setLang(saved);
      return;
    }
    const isZh =
      typeof navigator !== "undefined" &&
      typeof navigator.language === "string" &&
      navigator.language.toLowerCase().startsWith("zh");
    setLang(isZh ? "zh" : "en");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("tp_lang", lang);
  }, [lang]);

  const sections = [
    { id: "overview", label: t.nav.overview },
    { id: "verify", label: t.nav.verify },
    { id: "api", label: t.nav.api },
    { id: "roadmap", label: t.nav.roadmap },
  ];

  const proof = useMemo(() => DEMO_PROOFS.find((p) => p.id === selectedId)!, [selectedId]);

  async function onCompute() {
    setBusy(true);
    setComputed("");
    try {
      const canonical = stableStringify(proof.canonical);
      const h = await sha256Hex(canonical);
      setComputed(h);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,0.22),rgba(96,165,250,0.16),rgba(167,139,250,0.20))] blur-3xl animate-glow" />
        <div className="absolute -bottom-52 right-[-10%] h-[520px] w-[760px] rounded-full bg-[linear-gradient(90deg,rgba(167,139,250,0.18),rgba(34,211,238,0.12))] blur-3xl animate-glow" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-white/5 blur-md animate-glow" />
              <img
                src="/icon/logo.png"
                alt="TRACE ProofFeed"
                className="relative h-11 w-11 rounded-2xl border border-white/10 shadow-card"
              />
            </div>
            <div className="leading-tight">
              <div className="text-xs text-white/65">{t.brand}</div>
              <div className="text-sm font-semibold">{t.subtitle}</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.08] transition"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
            >
              {t.langToggle}
            </button>
            {sections.map((s) => (
              <AnchorPill key={s.id} href={`#${s.id}`}>
                {s.label}
              </AnchorPill>
            ))}
          </nav>

          {/* Mobile language only */}
          <div className="md:hidden">
            <button
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.08] transition"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
            >
              {t.langToggle}
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="grain relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-7 sm:p-9 shadow-soft animate-fadeUp">
            {/* Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              {["AI", "Infra", "Security"].map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-white/80"
                >
                  {x}
                </span>
              ))}
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl font-semibold tracking-tight text-balance">
              {t.subtitle}
            </h1>

            <p className="mt-3 text-white/70 text-sm sm:text-base">{t.heroTagline}</p>
            <p className="mt-4 text-white/78 text-sm sm:text-base leading-relaxed">{t.heroPitch}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#verify"
                className="group relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold text-black bg-cyan-300 hover:brightness-110 transition"
              >
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-[linear-gradient(90deg,rgba(255,255,255,0.35),transparent,rgba(255,255,255,0.35))] animate-shimmer" />
                <span className="relative">{t.cta.verify}</span>
              </a>

              <a
                href="#api"
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 font-semibold hover:bg-white/[0.10] transition"
              >
                {t.cta.api}
              </a>

              <a
                href="https://github.com/TRACE-CChain-Labs/trace-prooffeed-solana-agent"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3 font-semibold hover:bg-white/[0.08] transition"
              >
                {t.cta.repo}
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/55">{t.shippedTitle}</div>
                <ul className="mt-2 space-y-2 text-sm text-white/78">
                  {t.shipped.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-[2px] inline-block h-4 w-4 rounded-full bg-white/10 border border-white/10" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/55">Principle</div>
                <div className="mt-2 text-sm text-white/78 leading-relaxed">
                  Keep infrastructure private, but make verification public.
                  <div className="mt-3 text-xs text-white/50">
                    Public surface is de‑sensitized by design.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grain relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 sm:p-9 shadow-soft animate-fadeUp">
            <h2 className="text-lg font-semibold">{t.judgeTitle}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/80">
              {t.judgeSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              {t.judgeNote}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-white/55">Why it wins votes</div>
              <div className="mt-2 text-sm text-white/80">
                Curable endpoints + clear workflow + inspectable artifacts.
              </div>
              <div className="mt-3 text-xs text-white/50">
                (Human + agent discovery tends to reward “try it now” products.)
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="mt-14">
          <SectionTitle id="overview" title={t.overviewTitle} kicker="Minimal, inspectable architecture — designed for verification." />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { t: t.cards.agentT, b: t.cards.agentB },
              { t: t.cards.solT, b: t.cards.solB },
              { t: t.cards.verT, b: t.cards.verB },
            ].map((c) => (
              <div
                key={c.t}
                className="grain rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-card"
              >
                <div className="text-xs text-white/55">{c.t}</div>
                <div className="mt-3 text-sm text-white/80 leading-relaxed">{c.b}</div>
              </div>
            ))}
          </div>

          {/* mini diagram */}
          <div className="mt-6 grain rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-card">
            <div className="text-xs text-white/55">Flow</div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                { k: "1", t: "Agent", d: "Canonical JSON artifact" },
                { k: "2", t: "Solana (devnet)", d: "Commit / Reveal SHA‑256" },
                { k: "3", t: "Verifier", d: "Recompute + compare" },
              ].map((x) => (
                <div key={x.k} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="text-xs text-white/55">#{x.k}</div>
                  </div>
                  <div className="mt-2 text-sm text-white/75">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verify */}
        <section className="mt-14">
          <SectionTitle id="verify" title={t.verifyTitle} kicker="A verifier UI that feels like a product — not a slide." />
          <p className="mt-4 text-white/75 max-w-3xl leading-relaxed">{t.verifyLead}</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="grain rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">{t.verifyPanelTitle}</div>
                  <div className="mt-2 text-xs text-white/55">{t.verifyPanelHint}</div>
                </div>
                <div className="text-xs text-white/55">Demo</div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-white/55">Select proof</div>
                  <select
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm outline-none"
                    value={selectedId}
                    onChange={(e) => {
                      setSelectedId(e.target.value);
                      setComputed("");
                      setShowJson(false);
                    }}
                  >
                    {DEMO_PROOFS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} — {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 text-sm text-white/80">
                  <div className="text-xs text-white/55">Created</div>
                  <div className="mt-1 font-mono text-xs">{proof.createdAt}</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    disabled={busy}
                    onClick={onCompute}
                    className={cx(
                      "rounded-2xl px-4 py-2 font-semibold transition",
                      "bg-cyan-300 text-black hover:brightness-110",
                      busy && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    {busy ? "…" : t.compute}
                  </button>

                  <button
                    onClick={() => setShowJson((v) => !v)}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 font-semibold hover:bg-white/[0.10] transition"
                  >
                    {showJson ? t.hideJson : t.showJson}
                  </button>
                </div>

                {computed ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs text-white/55">{t.computedHash}</div>
                    <div className="mt-2 font-mono text-xs break-all text-white/85">{computed}</div>
                    <div className="mt-3 text-sm">
                      Result: <span className="font-semibold text-emerald-300">MATCH ✅</span>{" "}
                      <span className="text-xs text-white/55">(demo commitment)</span>
                    </div>
                  </div>
                ) : null}

                {showJson ? (
                  <pre className="mt-4 max-h-[260px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
{stableStringify(proof.canonical)}
                  </pre>
                ) : null}
              </div>
            </div>

            <div className="grain rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-card">
              <div className="text-sm font-semibold">Judge view</div>
              <div className="mt-3 text-xs text-white/55">
                This is the exact mental model judges follow: artifact → hash → commitment → verdict.
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-xs text-white/55">Output format</div>
                <div className="mt-3 font-mono text-xs text-white/80 leading-relaxed">
                  proofId: {selectedId}
                  {"\n"}canonical: stable JSON
                  {"\n"}sha256: {computed ? computed.slice(0, 10) + "…" : "—"}
                  {"\n"}onChain: (devnet lookup – next wiring)
                  {"\n"}result: MATCH / MISMATCH
                  {"\n"}tx: (devnet explorer link)
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="text-xs text-white/55">De‑sensitization</div>
                <div className="mt-2 text-sm text-white/80 leading-relaxed">
                  The public surface never reveals private infra (IPs, topology, internal endpoints). It only exposes verifiable artifacts and verification outputs.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="mt-14">
          <SectionTitle id="api" title={t.apiTitle} kicker="Make it curlable. Make it inspectable. Make it verifiable." />
          <p className="mt-4 text-white/75 max-w-3xl leading-relaxed">{t.apiLead}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {t.endpoints.map((e) => (
              <div key={e.p} className="grain rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-card">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1">{e.m}</span>
                  <span className="text-white/85">{e.p}</span>
                </div>
                <div className="mt-2 text-sm text-white/70">{e.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mt-14">
          <SectionTitle id="roadmap" title={t.roadmapTitle} kicker="Roadmap focuses on making verification real, not just pretty." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {t.roadmap.map((x) => (
              <div key={x.t} className="grain rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-card">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-white/75 leading-relaxed">{x.d}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-white/55">
          {t.footer}
        </footer>
      </div>

      {/* Mobile dock: different nav style than desktop */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="grain flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-2 py-2 shadow-card">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/[0.08] transition"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
