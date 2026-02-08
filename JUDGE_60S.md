# JUDGE IN 60 SECONDS — TRACE ProofFeed (MATCH / MISMATCH)

## What this proves
TRACE ProofFeed makes agent outputs tamper-evident:
- Canonical JSON artifact -> SHA-256
- Hash is committed on Solana Devnet
- Anyone can recompute later to verify: MATCH or MISMATCH

## 60s Quickstart (Windows PowerShell)

### 1) Fetch latest proof index
curl.exe -s "https://trace-prooffeed.vercel.app/api/proofs/latest?n=1" | Tee-Object -FilePath latest.json

### 2) Fetch a specific artifact
# Replace DEMO_ID with the id you see in latest.json (example: demo-001)
curl.exe -s "https://trace-prooffeed.vercel.app/api/proofs/demo-001" | Tee-Object -FilePath artifact.json

### 3) Compute SHA-256 locally
Get-FileHash .\artifact.json -Algorithm SHA256 | Format-List

### 4) Compare with on-chain commitment
In the proof response, find the devnet commitment (tx signature or stored hash).
Confirm: on-chain hash == local SHA-256  => MATCH

## Negative test (tamper detection)
1) Edit one character in artifact.json
2) Recompute SHA-256
3) Compare again => MISMATCH
