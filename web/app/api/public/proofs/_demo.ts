export type DemoProof = {
  proofId: string;
  createdAt: string;
  title: string;
  canonicalArtifact: string;
  network: "solana-devnet";

  // on-chain memo anchor (devnet)
  txSig?: string;
  explorer?: string;

  // optional / legacy naming if you want
  commitment?: string;
  tx?: string;
};

const p1 = `{"kind":"trace.reasoning","version":1,"topic":"CPI surprise","inputs":{"cpi":"3.3%","consensus":"3.1%"},"steps":["Detect delta","Assess risk sentiment","Record conclusion"],"conclusion":"Higher-for-longer risk increases short-term volatility."}`;
const p2 = `{"kind":"trace.reasoning","version":1,"topic":"SOL staking","inputs":{"apr":"7.1%","inflation":"~5%"},"steps":["Compute real yield","Check slashing assumptions","Summarize"],"conclusion":"Staking yield is attractive but depends on validator risk model."}`;
const p3 = `{"kind":"trace.reasoning","version":1,"topic":"Prediction market","inputs":{"market":"event contract","price":"0.62"},"steps":["Interpret price as probability","Check liquidity","Record"],"conclusion":"Market-implied probability ~62% with liquidity caveats."}`;

// ✅ Your devnet memo anchors (from your console output)
const TX = {
  "demo-001": "4jdRRSMozik3koDkKyPCQVb8Ez5Mbeja9fmAy8ubyW2KEYZxJcrWwq3zJYnsCW5Avrxya1XfwMSjA9nXCEAsMBmG",
  "demo-002": "2RFkv4oJ6J7oKo9fDGHjPrcztduY6hbJENDMDiPtRJPTM5yLyLgpidBgkwQXuAaT5KrgKDq1GuWEmTMhpzZeUUXZ",
  "demo-003": "21wzkQF1yEMx3qRtoc25SoJUyNVbxw6wKst2rG7y5FpCij6494irB8e6oMe4MdYz1UMgnPBFdFDqBUkzAj6q1UEn",
} as const;

function explorer(sig: string) {
  return `https://explorer.solana.com/tx/${sig}?cluster=devnet`;
}

export const DEMO_PROOFS: DemoProof[] = [
  {
    proofId: "demo-001",
    createdAt: "2026-02-06T00:00:00Z",
    title: "Demo #1 — CPI surprise → volatility stance",
    canonicalArtifact: p1,
    network: "solana-devnet",
    txSig: TX["demo-001"],
    explorer: explorer(TX["demo-001"]),
  },
  {
    proofId: "demo-002",
    createdAt: "2026-02-06T00:01:00Z",
    title: "Demo #2 — SOL staking → real yield summary",
    canonicalArtifact: p2,
    network: "solana-devnet",
    txSig: TX["demo-002"],
    explorer: explorer(TX["demo-002"]),
  },
  {
    proofId: "demo-003",
    createdAt: "2026-02-06T00:02:00Z",
    title: "Demo #3 — Event contract → probability reading",
    canonicalArtifact: p3,
    network: "solana-devnet",
    txSig: TX["demo-003"],
    explorer: explorer(TX["demo-003"]),
  },
];

export function getLatest(n: number) {
  const nn = Number.isFinite(n) ? Math.max(1, Math.min(50, n)) : 10;
  return [...DEMO_PROOFS].reverse().slice(0, nn);
}

export function getById(id: string) {
  return DEMO_PROOFS.find((p) => p.proofId === id) ?? null;
}
