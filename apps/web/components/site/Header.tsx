"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, HEADER_NAV } from "@/lib/site";
import { PhoneIcon } from "./PhoneIcon";

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
            {HEADER_NAV.map((item) => (
              <li
                key={item.href}
                className={
                  "children" in item && item.children ? "has-dropdown" : ""
                }
              >
                <Link href={item.href}>{item.label}</Link>
                {"children" in item && item.children ? (
                  <div className="dropdown">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <a href={SITE.phoneHref} className="nav-phone" aria-label={`Call ${SITE.phone}`}>
              <span className="nav-phone-icon">
                <PhoneIcon />
              </span>
              <span className="nav-phone-text">{SITE.phone}</span>
            </a>
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
