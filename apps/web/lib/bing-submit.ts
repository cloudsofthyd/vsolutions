// Bing Webmaster Tools URL submission helper.
// Reads BING_WEBMASTER_API_KEY from env. No-ops gracefully if missing so
// it's safe to call from any code path (dev, migration scripts, etc.).
//
// API docs:  https://learn.microsoft.com/en-us/bingwebmaster/getting-access
// Endpoint:  https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl
//            https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch
// Quota:     10,000 URLs/day, 500 URLs per batch call.

const BING_API = "https://ssl.bing.com/webmaster/api.svc/json";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vsolutionsinc.com";

export type BingResult =
  | { ok: true; submitted: number }
  | { ok: false; error: string; submitted?: number };

export async function submitUrlToBing(url: string): Promise<BingResult> {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) return { ok: false, error: "BING_WEBMASTER_API_KEY not set" };

  try {
    const res = await fetch(`${BING_API}/SubmitUrl?apikey=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ siteUrl: SITE_URL, url }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true, submitted: 1 };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function submitUrlsToBing(urls: string[]): Promise<BingResult> {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) return { ok: false, error: "BING_WEBMASTER_API_KEY not set" };
  if (urls.length === 0) return { ok: true, submitted: 0 };

  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 500) chunks.push(urls.slice(i, i + 500));

  let submitted = 0;
  let lastError: string | null = null;
  for (const chunk of chunks) {
    try {
      const res = await fetch(`${BING_API}/SubmitUrlBatch?apikey=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ siteUrl: SITE_URL, urlList: chunk }),
      });
      if (res.ok) {
        submitted += chunk.length;
      } else {
        const body = await res.text().catch(() => "");
        lastError = `HTTP ${res.status}: ${body.slice(0, 200)}`;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  if (submitted === 0 && lastError) return { ok: false, error: lastError };
  return { ok: true, submitted };
}

export async function getBingQuota(): Promise<
  | { ok: true; daily: number; monthly: number }
  | { ok: false; error: string }
> {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) return { ok: false, error: "BING_WEBMASTER_API_KEY not set" };
  try {
    const res = await fetch(
      `${BING_API}/GetUrlSubmissionQuota?apikey=${key}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    );
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const j = (await res.json()) as { d?: { DailyQuota?: number; MonthlyQuota?: number } };
    return {
      ok: true,
      daily: j.d?.DailyQuota ?? 0,
      monthly: j.d?.MonthlyQuota ?? 0,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
