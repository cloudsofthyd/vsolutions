// Static homepage sections (hero through clients-grid + CTA) — pulled from
// vsolutions-homepage-realbrand-v2.html with all vsolutionsinc.com image URLs
// rewritten to /uploads/. Renders via dangerouslySetInnerHTML so we preserve the
// full design exactly. Dynamic LatestBlog is rendered separately above the CTA.

import { HOMEPAGE_STATIC_HTML } from "./homepage-static";

export function HomepageHero() {
  return <div dangerouslySetInnerHTML={{ __html: HOMEPAGE_STATIC_HTML }} />;
}

export function HomepageCta() {
  return (
    <section className="cta fade-up">
      <div className="container">
        <div className="cta-box">
          <div className="cta-content">
            <div className="sec-eyebrow" style={{ justifyContent: "center" }}>
              Let&apos;s Build Together
            </div>
            <h3>
              Unstoppable growth — <em>starting today.</em>
            </h3>
            <p>
              One Partner. Every Solution. Talk to our team and discover how V
              Solutions can transform your business.
            </p>
            <div className="cta-actions">
              <a href="/contact/" className="btn btn-primary">
                Contact Us <span className="btn-arrow">→</span>
              </a>
              <a href="tel:2482328488" className="btn btn-ghost">
                📞 248 232 8488
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
