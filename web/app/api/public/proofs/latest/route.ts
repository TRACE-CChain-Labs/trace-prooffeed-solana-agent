export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getLatest } from "../_demo";

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const n = parseInt(searchParams.get("n") ?? "10", 10);

  const items = getLatest(n).map(p => ({
    ...p,
    sha256: sha256Hex(p.canonicalArtifact),
    source: "demo",
  }));

  return NextResponse.json({ ok: true, items }, { headers: { "Cache-Control": "no-store" } });
}