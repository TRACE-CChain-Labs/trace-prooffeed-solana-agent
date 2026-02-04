# TRACE ProofFeed

**Verifiable Agent Reasoning (Solana Devnet) — Commit → Reveal → Verify**

TRACE ProofFeed turns an agent’s reasoning output into a **tamper-evident artifact**.  
An agent run emits a **canonical JSON reasoning artifact**, we compute **SHA-256**, **commit** the hash on **Solana Devnet**, then anyone can later **recompute** and verify **MATCH / MISMATCH** against the on-chain commitment.

> This project does **not** judge whether reasoning is “correct”.  
> It proves whether a published reasoning artifact has been **altered after the commitment**.

---

## Live Demo (Judges)

### Public Verifier UI
- **Web:** https://trace-prooffeed.vercel.app

### Verifier API (via the Web project)
- **Health:** https://trace-prooffeed.vercel.app/api/healthz  
- **Latest proofs:** https://trace-prooffeed.vercel.app/api/proofs/latest?n=3  
- **Proof detail (example):** https://trace-prooffeed.vercel.app/api/proofs/demo-001  

> Public demo is **de-sensitized by design**.  
> The verifier backend is self-hosted and accessed through a **secure proxy + token auth**, so the demo does not leak private infrastructure.

---

## Judge Quickstart (60 seconds)

1) Open the public UI  
   - https://trace-prooffeed.vercel.app

2) Fetch latest proofs  
   - https://trace-prooffeed.vercel.app/api/proofs/latest?n=3

3) Open one proof (e.g. `demo-001`)  
   - https://trace-prooffeed.vercel.app/api/proofs/demo-001

4) What you verify  
   - The proof contains a **canonical JSON artifact** (deterministic).
   - The verifier computes **sha256(canonical_artifact)**.
   - That hash must match the **on-chain commitment** recorded on **Solana Devnet**.

✅ If hashes match → **MATCH** (artifact unchanged since commit)  
❌ If hashes differ → **MISMATCH** (artifact tampered / re-generated / modified)

---

## Why This Matters

Agents are increasingly used in high-impact contexts (trading, security, governance).  
But today, most “agent logs” are **mutable**: they can be rewritten, summarized differently, or regenerated after the fact.

TRACE ProofFeed introduces **cryptographic accountability for reasoning**:

- **Verifiable**: anyone can recompute the same hash.
- **Auditable**: commitments are immutable and timestamped on-chain.
- **Composable**: other systems can build reputation, dispute resolution, or governance auditing on top.

---

## Core Idea

> **Reasoning Artifact → SHA-256 → On-chain Commitment → Independent Verification**

We treat reasoning as a **data artifact** that can be cryptographically anchored, similar to how we anchor execution/state proofs.

---

## Architecture Overview

**Components (intentionally minimal and inspectable):**

1) **Agent**
   - Produces a reasoning artifact (canonical JSON)
   - Deterministic serialization ensures stable hashing

2) **Commitment Layer (Solana Devnet)**
   - Stores the SHA-256 commitment hash (and minimal metadata)

3) **Indexer / ProofFeed Service**
   - Tracks proof metadata (off-chain)
   - Exposes endpoints for proofs + verification

4) **Verifier**
   - Recomputes SHA-256 from revealed artifact
   - Compares against the on-chain commitment
   - Outputs `MATCH` / `MISMATCH`

---

## Proof Flow (Commit → Reveal → Verify)

### 1) Produce (Agent)
- Agent emits a **canonical JSON** reasoning artifact:
  - stable key ordering
  - stable whitespace rules
  - deterministic serialization

### 2) Commit (On-chain)
- Compute: `commitment = sha256(canonical_json_bytes)`
- Record the commitment on **Solana Devnet** via an Anchor program

### 3) Reveal (Off-chain)
- Publish the full artifact (and/or store it in a public proof registry)

### 4) Verify (Anyone)
- Recompute: `sha256(revealed_canonical_json_bytes)`
- Compare to the on-chain commitment
- Result:
  - `MATCH` if unchanged
  - `MISMATCH` if altered

---

## Solana Integration

- **Network:** Solana Devnet
- **Purpose:** immutable, timestamped commitment anchor
- **On-chain data:** commitment hash + minimal metadata only  
  (raw reasoning is not stored on-chain)

Solana is used as a **commitment anchor**, not a data store.

---

## What This Project Is / Is Not

### ✅ This project IS:
- A verifiable reasoning commitment pipeline
- A minimal verifier + proof registry pattern
- A composable primitive for trust-minimized agent infrastructure

### ❌ This project is NOT:
- A judge of “correctness” of reasoning
- A behavior enforcement system
- A replacement for existing agent frameworks

---

## Repository Structure

> (Folder names may evolve; this describes the intended boundaries.)

- `programs/` — Anchor program (commitment registry)
- `agent/` — agent-side artifact generation + commit logic
- `verifier/` — deterministic hashing + verification routines
- `web/` — public UI + API routes (Vercel deploy)
- `README.md` — judge-ready overview + quickstart

Each module is designed to be reviewed independently.

---

## Security & De-sensitization

- Public demo avoids leaking private topology:
  - no internal IPs
  - no node labels
  - no privileged endpoints exposed
- Backend access is protected behind a secure proxy + token auth.
- The trust story is explicit:
  - **Keep infra private**
  - **Make verification public**

---

## Roadmap (post-hackathon)

- Public “Verify” UI that shows:
  - proof list
  - computed hash
  - on-chain commitment hash
  - explorer link to devnet tx
- Multi-agent aggregation and reputation hooks
- Mainnet deployment (if/when needed)

---

## Links

- Repo: https://github.com/TRACE-CChain-Labs/trace-prooffeed-solana-agent  
- Live UI: https://trace-prooffeed.vercel.app
