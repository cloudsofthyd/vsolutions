import os from "node:os";

// Lightweight liveness endpoint hit by the ALB target-group health check.
// Avoids any DB/Redis dependency so it stays green during transient backend
// outages (the app itself is "live" — degraded data is a separate concern).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    {
      ok: true,
      service: "vsolutions-web",
      hostname: os.hostname(),
      uptime: Math.round(process.uptime()),
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
