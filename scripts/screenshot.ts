// Headless screenshot of the running dev site for visual verification.
import { chromium } from "playwright-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = process.env.BASE || "http://localhost:8000";

async function main() {
  const url = process.argv[2] || "/";
  const out = process.argv[3] || `homepage.png`;

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // log console errors
  const consoleErrors: string[] = [];
  page.on("pageerror", (err) => consoleErrors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 60000 });

  // wait extra for fade-in animations to settle
  await page.waitForTimeout(2000);

  // full-page screenshot
  await page.screenshot({ path: path.join(ROOT, out), fullPage: true });

  // measure: how tall is the page, do we have key sections?
  const audit = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll("section, footer, header"));
    const visible: { tag: string; cls: string; height: number; opacity: string; top: number }[] = [];
    sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      const style = window.getComputedStyle(s);
      visible.push({
        tag: s.tagName.toLowerCase(),
        cls: (s.className || "").toString().slice(0, 60),
        height: Math.round(r.height),
        opacity: style.opacity,
        top: Math.round(r.top + window.scrollY),
      });
    });
    return {
      pageHeight: document.documentElement.scrollHeight,
      sections: visible,
      title: document.title,
    };
  });

  console.log(`✔ Screenshot saved: ${out}`);
  console.log(`  Page title: ${audit.title}`);
  console.log(`  Page height: ${audit.pageHeight}px`);
  console.log(`  Sections (${audit.sections.length}):`);
  audit.sections.forEach((s) => {
    const flag = parseFloat(s.opacity) < 1 ? " ⚠️ HIDDEN" : "";
    console.log(`    [${s.tag}] ${s.cls.padEnd(40)} h=${s.height}px op=${s.opacity}${flag}`);
  });
  if (consoleErrors.length > 0) {
    console.log(`\n  ⚠️ Console errors:`);
    consoleErrors.forEach((e) => console.log(`    - ${e}`));
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
