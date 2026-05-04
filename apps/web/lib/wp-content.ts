// Last-mile WordPress content cleanup before render. Idempotent.
//
// - Strip Gutenberg block comments (<!-- wp:* -->)
// - Strip Yoast schema scripts
// - Auto-paragraph: WP stores plain text with bare line breaks; we wrap loose
//   blocks in <p> if they're not already wrapped.
// - Belt-and-suspenders: rewrite any vsolutionsinc.com URLs that slipped through.

const BLOCK_LEVEL = new Set([
  "p", "div", "section", "article", "aside", "header", "footer", "main", "nav",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "pre",
  "table", "tr", "td", "th", "thead", "tbody", "tfoot", "form", "figure",
  "iframe", "video", "audio", "img", "hr", "br",
]);

export function renderWpContent(html: string): string {
  if (!html) return "";

  let out = html
    // strip wp:* block comments
    .replace(/<!--\s*\/?wp:[^>]*-->/g, "")
    // strip <!--more-->
    .replace(/<!--\s*more\s*-->/gi, "")
    // any straggling vsolutionsinc URLs (defense-in-depth)
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/wp-content\/uploads\//g, "/uploads/")
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/uploads\//g, "/uploads/")
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\//g, "/")
    // SEO: enforce single H1 per page. Page header already supplies the H1
    // via <PageHero>, so demote any <h1> in the article body to <h2>.
    .replace(/<h1\b([^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    // Strip the placeholder counter widget that rendered as orphan text
    // ("1 + Projects Delivered ... 1 + Years of Collective Expertise"):
    // bogus stats that survived the Elementor → static-HTML migration.
    .replace(
      /\s*1\s*[+%]\s*Projects Delivered[\s\S]*?Years of Collective Expertise\s*/g,
      "",
    );

  // auto-paragraph: if content has no <p> at all, wrap each non-block paragraph
  if (!/<p\b/i.test(out)) {
    const blocks = out
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean);
    out = blocks
      .map((b) => {
        const tagMatch = b.match(/^<([a-z0-9]+)\b/i);
        const tag = tagMatch ? tagMatch[1].toLowerCase() : null;
        if (tag && BLOCK_LEVEL.has(tag)) return b;
        return `<p>${b.replace(/\n/g, "<br />")}</p>`;
      })
      .join("\n\n");
  }

  return out;
}
