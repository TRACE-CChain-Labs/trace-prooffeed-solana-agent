# \# TRACE ProofFeed (Solana Agent Hackathon)

# 

# \*\*Verifiable Agent Reasoning (Solana Devnet) — Commit → Reveal → Verify\*\*

# 

# TRACE ProofFeed turns an agent’s reasoning output into a \*\*tamper-evident artifact\*\*.  

# An agent run emits a \*\*canonical JSON reasoning artifact\*\*, we compute \*\*SHA-256\*\*, and (when wired) \*\*commit\*\* the hash on \*\*Solana Devnet\*\*.  

# Anyone can later \*\*recompute\*\* and verify \*\*MATCH / MISMATCH\*\* against the commitment.

# 

# > This project does \*\*not\*\* judge whether reasoning is “correct”.  

# > It proves whether a published reasoning artifact has been \*\*altered after it was anchored\*\*.

# 

# !\[Verify UI](docs/verify.png)

# 

# ---

# 

# \## Live Demo (Judges)

# 

# \### Public Verifier UI

# \- \*\*Web:\*\* https://trace-prooffeed.vercel.app

# 

# \### Public API (No Auth)

# > Judges should use the \*\*public\*\* endpoints below. No token required.

# 

# \- \*\*Health:\*\* https://trace-prooffeed.vercel.app/api/healthz  

# \- \*\*Latest proofs:\*\* https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3  

# \- \*\*Proof detail (example):\*\* https://trace-prooffeed.vercel.app/api/public/proofs/demo-001

# 

# \*\*One-liner (copy/paste)\*\*

# ~~~bash

# curl -s "https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3"

# ~~~

# 

# > Note: `/api/proofs/\*` is a protected interface for private verifier access.  

# > Public judging flow uses `/api/public/proofs/\*`.

# 

# ---

# 

# \## Judge Quickstart (60 seconds)

# 

# 1\) Open the public UI  

# &nbsp;  - https://trace-prooffeed.vercel.app

# 

# 2\) Fetch latest proofs (public)  

# &nbsp;  - https://trace-prooffeed.vercel.app/api/public/proofs/latest?n=3

# 

# 3\) Open one proof (e.g. `demo-001`)  

# &nbsp;  - https://trace-prooffeed.vercel.app/api/public/proofs/demo-001

# 

# 4\) What you verify  

# &nbsp;  - The proof contains a \*\*canonical JSON artifact\*\* (deterministic string).

# &nbsp;  - The verifier recomputes \*\*sha256(canonicalArtifact)\*\*.

# &nbsp;  - The verifier outputs a verification-style result: \*\*MATCH / MISMATCH\*\*.

# 

# ✅ If hashes match → \*\*MATCH\*\* (artifact unchanged)  

# ❌ If hashes differ → \*\*MISMATCH\*\* (artifact tampered / regenerated / modified)

# 

# ---

# 

# \## Why This Matters

# 

# Agents are increasingly used in high-impact contexts (trading, security, governance).  

# But today, most “agent logs” are \*\*mutable\*\*: they can be rewritten, summarized differently, or regenerated after the fact.

# 

# TRACE ProofFeed introduces \*\*cryptographic accountability for reasoning\*\*:

# 

# \- \*\*Verifiable\*\*: anyone can recompute the same hash.

# \- \*\*Auditable\*\*: commitments are immutable and timestamped on-chain (devnet for demo).

# \- \*\*Composable\*\*: other systems can build reputation, dispute resolution, or governance auditing on top.

# 

# ---

# 

# \## Core Idea

# 

# > \*\*Reasoning Artifact → SHA-256 → On-chain Commitment → Independent Verification\*\*

# 

# We treat reasoning as a \*\*data artifact\*\* that can be cryptographically anchored, similar to how we anchor execution/state proofs.

# 

# ---

# 

# \## Public Demo Model (De-sensitized / Proxied)

# 

# The public surface is designed to \*\*avoid leaking private infrastructure\*\*:

# \- no internal IPs

# \- no topology labels

# \- no privileged endpoints

# 

# For hackathon judging, the web deployment (e.g., Vercel) provides a \*\*public, no-auth\*\* feed:

# \- canonical artifacts

# \- computed hashes

# \- verification-style outputs

# 

# Privileged verification / devnet lookups can be wired behind protected routes.

# 

# ---

# 

# \## Architecture Overview

# 

# \*\*Components (intentionally minimal and inspectable):\*\*

# 

# 1\) \*\*Agent\*\*

# &nbsp;  - Produces a reasoning artifact (canonical JSON)

# &nbsp;  - Deterministic serialization ensures stable hashing

# 

# 2\) \*\*Commitment Layer (Solana Devnet)\*\*

# &nbsp;  - Stores the SHA-256 commitment hash (and minimal metadata)

# 

# 3\) \*\*Indexer / ProofFeed Service\*\*

# &nbsp;  - Tracks proof metadata (off-chain)

# &nbsp;  - Exposes proof endpoints + verification report

# 

# 4\) \*\*Verifier UI\*\*

# &nbsp;  - Recomputes SHA-256 from revealed artifact

# &nbsp;  - (Next wiring) compares against on-chain commitment

# &nbsp;  - Outputs `MATCH` / `MISMATCH`

# 

# ---

# 

# \## Proof Flow (Commit → Reveal → Verify)

# 

# \### 1) Produce (Agent)

# \- Agent emits a \*\*canonical JSON\*\* reasoning artifact:

# &nbsp; - stable key ordering

# &nbsp; - stable whitespace rules

# &nbsp; - deterministic serialization

# 

# \### 2) Commit (On-chain)

# \- Compute: `commitment = sha256(canonical\_json\_bytes)`

# \- Record the commitment on \*\*Solana Devnet\*\* via an Anchor program

# 

# \### 3) Reveal (Off-chain)

# \- Publish the full artifact (and/or store it in a public proof registry)

# 

# \### 4) Verify (Anyone)

# \- Recompute: `sha256(revealed\_canonical\_json\_bytes)`

# \- Compare to commitment

# \- Result:

# &nbsp; - `MATCH` if unchanged

# &nbsp; - `MISMATCH` if altered

# 

# ---

# 

# \## Repository Structure

# 

# \- `program/` — Anchor program (commitment registry)

# \- `agent/` — agent-side artifact generation + commit logic

# \- `web/` — public UI + API routes (Vercel deploy)

# \- `docs/verify.png` — README screenshot

# 

# ---

# 

# \## Local Development (web)

# 

# ~~~bash

# cd web

# npm ci

# npm run dev

# ~~~

# 

# Then open:

# \- http://localhost:3000

# \- http://localhost:3000/api/healthz

# \- http://localhost:3000/api/public/proofs/latest?n=3

# \- http://localhost:3000/api/public/proofs/demo-001

# 

# ---

# 

# \## Optional: Simple Flow Diagram (GitHub renders this)

# 

# ~~~mermaid

# flowchart LR

# &nbsp; A\[Agent reasoning] --> B\[canonicalArtifact JSON]

# &nbsp; B --> C\[sha256(canonicalArtifact)]

# &nbsp; C --> D\[/api/public/proofs/latest]

# &nbsp; C --> E\[/api/public/proofs/:id]

# &nbsp; D --> F\[Verifier UI]

# &nbsp; E --> F\[Verifier UI]

# &nbsp; F --> G\[On-chain lookup wiring (next)]

# ~~~

# 

# ---

# 

# \## Security \& De-sensitization

# 

# \- Public demo avoids leaking private topology:

# &nbsp; - no internal IPs

# &nbsp; - no node labels

# &nbsp; - no privileged endpoints exposed

# \- Protected interfaces can live behind a secure proxy + token auth.

# \- The trust story is explicit:

# &nbsp; - \*\*Keep infra private\*\*

# &nbsp; - \*\*Make verification public\*\*

# 

# ---

# 

# \## Roadmap (post-hackathon)

# 

# \- Live chain comparison in the verifier:

# &nbsp; - show computed hash

# &nbsp; - fetch on-chain commitment hash

# &nbsp; - include explorer link to devnet tx

# \- Multi-agent aggregation + reputation hooks

# \- Mainnet deployment (if/when needed)

# 

# ---

# 

# \## Links

# 

# \- Repo: https://github.com/TRACE-CChain-Labs/trace-prooffeed-solana-agent  

# \- Live UI: https://trace-prooffeed.vercel.app



