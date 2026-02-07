export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getById } from "../../proofs/_demo";

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function idFromUrl(req: Request) {
  try {
    const u = new URL(req.url);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    return "";
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> } | any) {
  let id = "";
  try {
    if (ctx?.params) {
      const p = await ctx.params;
      id = p?.id ? String(p.id) : "";
    }
  } catch {}

  if (!id) id = idFromUrl(req);
  id = decodeURIComponent(String(id || "")).trim();

  if (!id || id === "[id]") {
    return NextResponse.json({ ok: false, error: "BAD_PARAMS" }, { status: 400 });
  }

  const proof = getById(id);
  if (!proof) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  const computed = sha256Hex(proof.canonicalArtifact);
  const tx = (proof as any).tx || null;

  return NextResponse.json(
    {
      ok: true,
      proofId: proof.proofId,
      computedSha256: computed,
      onchain: tx
        ? {
            txSig: tx,
            explorer: `https://explorer.solana.com/tx/${tx}?cluster=devnet`,
            memoFormat: `trace_pf_v1|${proof.proofId}|${computed}`,
          }
        : {
            txSig: null,
            explorer: null,
            memoFormat: `trace_pf_v1|${proof.proofId}|${computed}`,
          },
      note: "This endpoint does not prove correctness. It proves whether the published artifact hash matches the on-chain anchored value.",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}