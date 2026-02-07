export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getById } from "../_demo";

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

export async function GET(req: Request, ctx: any) {
  // Next 16+: params is a Promise
  let id = "";
  try {
    if (ctx?.params) {
      const p = await ctx.params;
      id = p?.id ? String(p.id) : "";
    }
  } catch {
    // ignore and fallback to URL parsing
  }

  if (!id) id = idFromUrl(req);
  id = decodeURIComponent(String(id || "")).trim();

  if (!id || id === "[id]") {
    return NextResponse.json({ ok: false, error: "BAD_PARAMS" }, { status: 400 });
  }

  const proof = getById(id);
  if (!proof) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(
    {
      ok: true,
      proof: {
        ...proof,
        sha256: sha256Hex(proof.canonicalArtifact),
        source: "demo",
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}