import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <section className="hero hero-compact fade-up visible">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow" style={{ justifyContent: "center" }}>404</div>
          <h1 className="sec-title">
            Page not <em>found.</em>
          </h1>
          <p className="hero-sub" style={{ margin: "1.5rem auto" }}>
            That page doesn&apos;t exist on V Solutions Inc — try the home page or
            our blog.
          </p>
          <div className="cta-actions" style={{ justifyContent: "center" }}>
            <Link href="/" className="btn btn-primary">
              Home <span className="btn-arrow">→</span>
            </Link>
            <Link href="/blog-insights/" className="btn btn-ghost">
              Blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
