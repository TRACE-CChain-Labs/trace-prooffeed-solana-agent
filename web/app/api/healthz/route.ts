import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function j(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET(_req: NextRequest) {
  // 不回任何機敏（不回 origin、不回 token）
  const hasOrigin = !!process.env.VERIFIER_ORIGIN;
  const hasToken = !!process.env.VERIFIER_TOKEN;

  return j({
    ok: true,
    service: "trace-prooffeed-web",
    ts: new Date().toISOString(),
    verifierConfigured: hasOrigin && hasToken,
  });
}
