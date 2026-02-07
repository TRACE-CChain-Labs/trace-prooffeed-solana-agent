import fs from "fs";
import crypto from "crypto";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const RPC = process.env.SOLANA_RPC || "https://api.devnet.solana.com";
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function loadPayer(path) {
  if (!fs.existsSync(path)) {
    console.error("Missing payer keypair:", path);
    console.error("Create it first (or restore) and fund it via https://faucet.solana.com (Devnet).");
    process.exit(2);
  }
  const arr = JSON.parse(fs.readFileSync(path, "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}

const DEMO = {
  "demo-001": "{\"kind\":\"trace.reasoning\",\"version\":1,\"topic\":\"CPI surprise\",\"inputs\":{\"cpi\":\"3.3%\",\"consensus\":\"3.1%\"},\"steps\":[\"Detect delta\",\"Assess risk sentiment\",\"Record conclusion\"],\"conclusion\":\"Higher-for-longer risk increases short-term volatility.\"}",
  "demo-002": "{\"kind\":\"trace.reasoning\",\"version\":1,\"topic\":\"SOL staking\",\"inputs\":{\"apr\":\"7.1%\",\"inflation\":\"~5%\"},\"steps\":[\"Compute real yield\",\"Check slashing assumptions\",\"Summarize\"],\"conclusion\":\"Staking yield is attractive but depends on validator risk model.\"}",
  "demo-003": "{\"kind\":\"trace.reasoning\",\"version\":1,\"topic\":\"Prediction market\",\"inputs\":{\"market\":\"event contract\",\"price\":\"0.62\"},\"steps\":[\"Interpret price as probability\",\"Check liquidity\",\"Record\"],\"conclusion\":\"Market-implied probability ~62% with liquidity caveats.\"}",
};

async function main() {
  const proofId = process.argv[2];
  if (!proofId || !DEMO[proofId]) {
    console.error("Usage: node scripts/commit-demo-memo.mjs demo-001|demo-002|demo-003");
    process.exit(2);
  }

  const payerPath = ".demo-devnet-keypair.json";
  const payer = loadPayer(payerPath);

  console.log("RPC:", RPC);
  console.log("Payer pubkey:", payer.publicKey.toBase58());

  const conn = new Connection(RPC, "confirmed");
  const bal = await conn.getBalance(payer.publicKey);
  const sol = bal / LAMPORTS_PER_SOL;
  console.log("Balance SOL:", sol.toFixed(4));

  if (sol < 0.01) {
    console.error("\nBalance too low. Fund via https://faucet.solana.com (Devnet) then rerun.");
    process.exit(3);
  }

  const artifact = DEMO[proofId];
  const hash = sha256Hex(artifact);
  const memo = `trace_pf_v1|${proofId}|${hash}`;

  const ix = new TransactionInstruction({
    programId: MEMO_PROGRAM_ID,
    keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }],
    data: Buffer.from(memo, "utf8"),
  });

  const tx = new Transaction().add(ix);
  const sig = await sendAndConfirmTransaction(conn, tx, [payer], { commitment: "confirmed" });

  console.log("\nOK: memo anchored");
  console.log("proofId:", proofId);
  console.log("sha256 :", hash);
  console.log("txSig  :", sig);
  console.log("explorer:", `https://explorer.solana.com/tx/${sig}?cluster=devnet`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});