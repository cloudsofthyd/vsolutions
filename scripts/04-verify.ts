// Walk url-inventory.json against the running dev server.
// Bucket: ✅ OK | ↪️ Redirected | ⚠️ Degraded | ❌ Broken.
// Emit verification-report.html.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BASE = process.env.VERIFY_BASE_URL || "http://localhost:8000";
const CONCURRENCY = 6;

interface Entry {
  url: string;
  type: string;
  ref?: string | number;
}

interface Result extends Entry {
  status: number;
  finalUrl: string;
  redirected: boolean;
  duration: number;
  hasTitle: boolean;
  hasCanonical: boolean;
  bucket: "ok" | "redirect" | "degraded" | "broken";
  error?: string;
}

async function check(entry: Entry): Promise<Result> {
  const start = Date.now();
  let res: Response;
  try {
    res = await fetch(BASE + entry.url, {
      redirect: "manual",
      headers: { "User-Agent": "vsi-migration-verify/1.0" },
    });
  } catch (err) {
    return {
      ...entry,
      status: 0,
      finalUrl: BASE + entry.url,
      redirected: false,
      duration: Date.now() - start,
      hasTitle: false,
      hasCanonical: false,
      bucket: "broken",
      error: err instanceof Error ? err.message : String(err),
    };
  }
  const duration = Date.now() - start;

  // System URLs we expect non-200 from
  if (entry.type === "wp-login-redirect" || entry.type === "register-blocked") {
    const isRedirect = res.status >= 300 && res.status < 400;
    return {
      ...entry,
      status: res.status,
      finalUrl: res.headers.get("location") || BASE + entry.url,
      redirected: isRedirect,
      duration,
      hasTitle: false,
      hasCanonical: false,
      bucket: isRedirect ? "redirect" : "broken",
    };
  }

  if (res.status >= 300 && res.status < 400) {
    return {
      ...entry,
      status: res.status,
      finalUrl: res.headers.get("location") || BASE + entry.url,
      redirected: true,
      duration,
      hasTitle: false,
      hasCanonical: false,
      bucket: "redirect",
    };
  }

  if (res.status !== 200) {
    return {
      ...entry,
      status: res.status,
      finalUrl: BASE + entry.url,
      redirected: false,
      duration,
      hasTitle: false,
      hasCanonical: false,
      bucket: "broken",
    };
  }

  // 200 — read body to check title + canonical (only for HTML routes)
  const ct = res.headers.get("content-type") || "";
  let hasTitle = false;
  let hasCanonical = false;
  let bucket: "ok" | "degraded" = "ok";
  if (ct.includes("text/html")) {
    const html = await res.text();
    hasTitle = /<title>[^<]+<\/title>/i.test(html);
    hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    if (!hasTitle) bucket = "degraded";
  }

  return {
    ...entry,
    status: 200,
    finalUrl: BASE + entry.url,
    redirected: false,
    duration,
    hasTitle,
    hasCanonical,
    bucket,
  };
}

async function main() {
  const inventory: Entry[] = JSON.parse(
    await fs.readFile(path.join(ROOT, "dump/url-inventory.json"), "utf8"),
  );

  console.log(`Verifying ${inventory.length} URLs against ${BASE}`);

  const results: Result[] = [];
  let completed = 0;

  // simple worker pool
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const entry = inventory.shift();
      if (!entry) return;
      const r = await check(entry);
      results.push(r);
      completed++;
      if (completed % 10 === 0) {
        process.stdout.write(`  ${completed} done\r`);
      }
    }
  });
  await Promise.all(workers);
  process.stdout.write("\n");

  // bucketize
  const buckets = {
    ok: results.filter((r) => r.bucket === "ok"),
    redirect: results.filter((r) => r.bucket === "redirect"),
    degraded: results.filter((r) => r.bucket === "degraded"),
    broken: results.filter((r) => r.bucket === "broken"),
  };

  console.log(`\n=== Verification ===`);
  console.log(`  ✅ OK:        ${buckets.ok.length}`);
  console.log(`  ↪️  Redirect:  ${buckets.redirect.length}`);
  console.log(`  ⚠️  Degraded:  ${buckets.degraded.length}`);
  console.log(`  ❌ Broken:    ${buckets.broken.length}`);

  if (buckets.broken.length > 0) {
    console.log("\n--- Broken ---");
    for (const r of buckets.broken) {
      console.log(`  ${r.status} ${r.url} — ${r.error || ""}`);
    }
  }
  if (buckets.degraded.length > 0) {
    console.log("\n--- Degraded ---");
    for (const r of buckets.degraded) {
      console.log(`  ${r.status} ${r.url}  (no title)`);
    }
  }

  // HTML report
  const html = `<!doctype html>
<html><head><title>VSI Migration Verification</title>
<style>
body { font-family:-apple-system,system-ui,sans-serif; padding:2rem; max-width:1280px; margin:0 auto; background:#0E1B3A; color:#E2E8F0; }
h1 { color:#F2295B; }
table { width:100%; border-collapse:collapse; background:#1A2D5A; border-radius:8px; overflow:hidden; }
th, td { padding:.5rem .8rem; text-align:left; border-bottom:1px solid rgba(255,255,255,.1); font-size:.92rem; }
th { background:#243A75; cursor:pointer; user-select:none; }
.ok { color:#4ade80; }
.redirect { color:#60A5FA; }
.degraded { color:#F59E0B; }
.broken { color:#F2295B; font-weight:bold; }
.summary { display:flex; gap:1.5rem; margin:1.5rem 0; }
.summary-item { padding:1rem 1.5rem; border-radius:.75rem; background:#1A2D5A; }
.summary-item strong { font-size:1.5rem; display:block; }
a { color:#60A5FA; }
</style></head><body>
<h1>V Solutions migration — URL verification</h1>
<p>Tested against <code>${BASE}</code> · ${results.length} URLs · ${new Date().toISOString()}</p>
<div class="summary">
  <div class="summary-item ok"><strong>${buckets.ok.length}</strong>OK</div>
  <div class="summary-item redirect"><strong>${buckets.redirect.length}</strong>Redirect</div>
  <div class="summary-item degraded"><strong>${buckets.degraded.length}</strong>Degraded</div>
  <div class="summary-item broken"><strong>${buckets.broken.length}</strong>Broken</div>
</div>
<table>
<thead><tr><th>Bucket</th><th>Status</th><th>URL</th><th>Type</th><th>Title</th><th>Canonical</th><th>Final</th><th>ms</th></tr></thead>
<tbody>
${results
  .sort((a, b) => {
    const order = { broken: 0, degraded: 1, redirect: 2, ok: 3 };
    return order[a.bucket] - order[b.bucket];
  })
  .map(
    (r) => `<tr class="${r.bucket}">
<td>${r.bucket}</td>
<td>${r.status}</td>
<td><a href="${BASE}${r.url}">${r.url}</a></td>
<td>${r.type}</td>
<td>${r.hasTitle ? "✓" : "—"}</td>
<td>${r.hasCanonical ? "✓" : "—"}</td>
<td>${r.finalUrl !== BASE + r.url ? r.finalUrl : ""}</td>
<td>${r.duration}</td>
</tr>`,
  )
  .join("\n")}
</tbody></table>
</body></html>`;

  await fs.writeFile(path.join(ROOT, "verification-report.html"), html);
  console.log(`\n📄 Report: verification-report.html`);

  if (buckets.broken.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
