"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, HEADER_NAV } from "@/lib/site";
import { PhoneIcon } from "./PhoneIcon";
import { SiteSearch } from "./SiteSearch";

// At 1024–1099px these labels collapse into a "More ▾" dropdown so the nav
// stays single-line. They render normally above 1099px.
const OVERFLOW_LABELS = new Set<string>(["How we work", "Careers", "Pricing"]);

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open + Esc to close
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="container">
          <Link href="/" className="brand" title={SITE.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE.logoMain} alt={SITE.name} className="brand-logo" decoding="async" />
            <span className="brand-spark s1">✦</span>
            <span className="brand-spark s2">✦</span>
          </Link>

          <ul className="menu">
            {HEADER_NAV.map((item) => {
              const isOverflow = OVERFLOW_LABELS.has(item.label);
              const hasChildren = "children" in item && item.children;
              const cls = [
                hasChildren ? "has-dropdown" : "",
                isOverflow ? "menu-item--overflow" : "",
                pathname === item.href ? "is-active" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <li key={item.href} className={cls}>
                  <Link href={item.href}>{item.label}</Link>
                  {hasChildren ? (
                    <div className="dropdown">
                      {item.children!.map((c) => (
                        <Link key={c.href} href={c.href}>
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
            {/* Overflow group — shown only at 1024–1099px when individual items are hidden */}
            <li className="has-dropdown menu-more">
              <span className="menu-more-trigger" tabIndex={0}>
                More
              </span>
              <div className="dropdown">
                {HEADER_NAV.filter((it) => OVERFLOW_LABELS.has(it.label)).map(
                  (it) => (
                    <Link key={it.href} href={it.href}>
                      {it.label}
                    </Link>
                  ),
                )}
              </div>
            </li>
          </ul>

          <div className="nav-cta">
            <SiteSearch />
            <Link href="/contact/" className="btn btn-primary">
              Contact Us <span className="btn-arrow">→</span>
            </Link>
            <button
              type="button"
              className={`hamburger${open ? " is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer${open ? " is-open" : ""}`}
        aria-hidden={!open}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <nav
          className="mobile-drawer-panel"
          aria-label="Mobile"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-drawer-head">
            <Link href="/" className="brand" onClick={() => setOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE.logoMain}
                alt={SITE.name}
                className="brand-logo"
              />
            </Link>
            <button
              type="button"
              className="mobile-drawer-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <ul className="mobile-nav">
            {HEADER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="mobile-nav-item">
                  {item.label}
                  <span className="arr">→</span>
                </Link>
                {"children" in item && item.children && (
                  <ul className="mobile-subnav">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mobile-drawer-cta">
            <Link href="/contact/" className="btn btn-primary">
              Contact Us <span className="btn-arrow">→</span>
            </Link>
            <a href={SITE.phoneHref} className="mobile-drawer-phone">
              <PhoneIcon size={16} /> {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="mobile-drawer-email"
            >
              ✉ {SITE.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
