# TRACE ProofFeed (Solana Agent Hackathon)

**Verifiable Agent Reasoning (Solana Devnet) — Commit → Reveal → Verify**

TRACE ProofFeed turns an agent’s reasoning output into a **tamper-evident artifact**.  
An agent run emits a **canonical JSON reasoning artifact**, we compute **SHA-256**, and (when wired) **commit** the hash on **Solana Devnet**.  
Anyone can later **recompute** and verify **MATCH / MISMATCH** against the commitment.

> This project does **not** judge whether reasoning is “correct”.  
> It proves whether a published reasoning artifact has been **altered after it was anchored**.

![Verify UI](docs/verify.png)

---

## Live Demo (Judges)

### Public Verifier UI
- **Web:** https://trace-prooffeed.vercel.app

### Public API (No Auth)
> Judges should use the **public** endpoints below. No token required.

- **Health:** https://trace-prooffeed.vercel.app/api/healthz  
- **Latest proofs:** https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3  
- **Proof detail (example):** https://trace-prooffeed.vercel.app/api/public/proofs/demo-001

**One-liner (copy/paste)**
~~~bash
curl -s "https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3"
~~~

> Note: `/api/proofs/*` is a protected interface for private verifier access.  
> Public judging flow uses `/api/public/proofs/*`.

---

## Judge Quickstart (60 seconds)

1) Open the public UI  
   - https://trace-prooffeed.vercel.app

2) Fetch latest proofs (public)  
   - https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3

3) Open one proof (e.g. `demo-001`)  
   - https://trace-prooffeed.vercel.app/api/public/proofs/demo-001

4) What you verify  
   - The proof contains a **canonical JSON artifact** (deterministic string).
   - The verifier recomputes **sha256(canonicalArtifact)**.
   - The verifier outputs a verification-style result: **MATCH / MISMATCH**.

✅ If hashes match → **MATCH** (artifact unchanged)  
❌ If hashes differ → **MISMATCH** (artifact tampered / regenerated / modified)

---

## Why This Matters

Agents are increasingly used in high-impact contexts (trading, security, governance).  
But today, most “agent logs” are **mutable**: they can be rewritten, summarized differently, or regenerated after the fact.

TRACE ProofFeed introduces **cryptographic accountability for reasoning**:

- **Verifiable**: anyone can recompute the same hash.
- **Auditable**: commitments are immutable and timestamped on-chain (devnet for demo).
- **Composable**: other systems can build reputation, dispute resolution, or governance auditing on top.

---

## Core Idea

> **Reasoning Artifact → SHA-256 → On-chain Commitment → Independent Verification**

We treat reasoning as a **data artifact** that can be cryptographically anchored, similar to how we anchor execution/state proofs.

---

## Public Demo Model (De-sensitized / Proxied)

The public surface is designed to **avoid leaking private infrastructure**:
- no internal IPs
- no topology labels
- no privileged endpoints

For hackathon judging, the web deployment (e.g., Vercel) provides a **public, no-auth** feed:
- canonical artifacts
- computed hashes
- verification-style outputs

Privileged verification / devnet lookups can live behind protected routes.

---

## Architecture Overview

1) **Agent**
   - Produces a reasoning artifact (canonical JSON)
   - Deterministic serialization ensures stable hashing

2) **Commitment Layer (Solana Devnet)**
   - Stores the SHA-256 commitment hash (and minimal metadata)

3) **Indexer / ProofFeed Service**
   - Tracks proof metadata (off-chain)
   - Exposes proof endpoints + verification report

4) **Verifier UI**
   - Recomputes SHA-256 from revealed artifact
   - (Next wiring) compares against on-chain commitment
   - Outputs `MATCH` / `MISMATCH`

---

## Repository Structure

- `program/` — Anchor program (commitment registry)
- `agent/` — agent-side artifact generation + commit logic
- `web/` — public UI + API routes (Vercel deploy)
- `docs/verify.png` — README screenshot

---

## Local Development (web)

~~~bash
cd web
npm ci
npm run dev
~~~

Then open:
- http://localhost:3000
- http://localhost:3000/api/healthz
- http://localhost:3000/api/public/proofs/latest?n=3
- http://localhost:3000/api/public/proofs/demo-001

---

## Links

- Repo: https://github.com/TRACE-CChain-Labs/trace-prooffeed-solana-agent  
- Live UI: https://trace-prooffeed.vercel.app