import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  /** Optional breadcrumb trail. The last item should not have an href and renders as the active page. */
  breadcrumb?: BreadcrumbItem[];
  /** Small uppercase pill label (e.g. "Legal", "Resources"). */
  pillLabel?: string;
  /** Body text inside the pill (e.g. "Last updated Apr 2026"). */
  pillBody?: ReactNode;
  /** H1 title — wrap an italicized phrase in <em> for the gradient italic accent. */
  title: ReactNode;
  /** Optional Instrument Serif italic subhead. */
  subhead?: ReactNode;
  /** Optional muted paragraph beneath the subhead. */
  lede?: ReactNode;
  /** Optional extra content rendered after the lede (e.g. action buttons). */
  children?: ReactNode;
}

export function PageHero({
  breadcrumb,
  pillLabel,
  pillBody,
  title,
  subhead,
  lede,
  children,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <span key={`${item.label}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
                  {i > 0 && <span className="sep">/</span>}
                  {item.href && !isLast ? (
                    <a href={item.href}>{item.label}</a>
                  ) : (
                    <span className="current">{item.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        )}

        {(pillLabel || pillBody) && (
          <div className="page-hero-pill">
            {pillLabel && <span className="label">{pillLabel}</span>}
            {pillBody && <span>{pillBody}</span>}
          </div>
        )}

        <h1 className="page-hero-title">{title}</h1>

        {subhead && <p className="page-hero-subhead">{subhead}</p>}
        {lede && <p className="page-hero-lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
