export const runtime = "nodejs";

import crypto from "crypto";
import { NextResponse } from "next/server";
import { getById } from "../_demo";

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function getIdFromUrl(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export async function GET(req: Request, ctx?: { params?: { id?: string } }) {
  const id = ctx?.params?.id ?? getIdFromUrl(req);

  if (!id || id === "[id]") {
    return NextResponse.json(
      { ok: false, error: "BAD_ID", got: { id, path: new URL(req.url).pathname } },
      { status: 400 }
    );
  }

  const proof = getById(id);
  if (!proof) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND", id }, { status: 404 });
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