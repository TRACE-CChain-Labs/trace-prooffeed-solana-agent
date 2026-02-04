import { NextRequest } from "next/server";

export const runtime = "nodejs";

function withAuth(req: NextRequest) {
  const token = process.env.VERIFIER_TOKEN;
  if (!token) return { ok: false, status: 500, msg: "Missing VERIFIER_TOKEN" };

  const got =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.headers.get("x-verifier-token") ||
    "";

  if (!got || got !== token) return { ok: false, status: 401, msg: "Unauthorized" };
  return { ok: true, status: 200, msg: "OK" };
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = withAuth(req);
  if (!auth.ok) return Response.json({ error: auth.msg }, { status: auth.status });

  const { id } = await ctx.params;

  const origin = process.env.VERIFIER_ORIGIN;
  if (!origin) return Response.json({ error: "Missing VERIFIER_ORIGIN" }, { status: 500 });

  const url = `${origin.replace(/\/$/, "")}/proofs/${encodeURIComponent(id)}`;

  const r = await fetch(url, {
    headers: {
      "accept": "application/json",
      "authorization": `Bearer ${process.env.VERIFIER_TOKEN}`,
    },
    cache: "no-store",
  });

  const text = await r.text();
  return new Response(text, {
    status: r.status,
    headers: {
      "content-type": r.headers.get("content-type") || "application/json",
      "cache-control": "no-store",
    },
  });
}
