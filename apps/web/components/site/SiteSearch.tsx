"use client";

import { Command } from "cmdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SERVICES, SERVICE_ORDER } from "@/lib/services-data";

type SearchHit = {
  group: "Services" | "Pages";
  label: string;
  href: string;
  hint?: string;
};

const STATIC_PAGES: SearchHit[] = [
  { group: "Pages", label: "Home", href: "/" },
  { group: "Pages", label: "About V Solutions", href: "/about-v-solutions-inc/" },
  { group: "Pages", label: "V-Framework", href: "/about-v-solutions-inc/v-framework/" },
  { group: "Pages", label: "How we work", href: "/how-we-work/" },
  { group: "Pages", label: "Service overview", href: "/service-overview/" },
  { group: "Pages", label: "Case studies", href: "/case-study/" },
  { group: "Pages", label: "Careers", href: "/careers/" },
  { group: "Pages", label: "Pricing", href: "/pricing/" },
  { group: "Pages", label: "Blog & Insights", href: "/blog-insights/" },
  { group: "Pages", label: "Portfolio", href: "/portfolio/" },
  { group: "Pages", label: "Contact", href: "/contact/" },
];

function buildIndex(): SearchHit[] {
  const services: SearchHit[] = SERVICE_ORDER.map((key) => {
    const s = SERVICES[key];
    return {
      group: "Services" as const,
      label: s.name,
      href: s.url,
      hint: s.tags.slice(0, 3).join(" · "),
    };
  });
  return [...services, ...STATIC_PAGES];
}

const isMac =
  typeof window !== "undefined" &&
  /Mac|iPhone|iPad/.test(window.navigator.platform);

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const hits = useMemo(buildIndex, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      // Defer focus until cmdk has mounted its input
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setValue("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        className="ui-search-trigger"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
      >
        <Search size={16} aria-hidden="true" />
        <span className="ui-search-trigger__placeholder">
          Search services, case studies, blogs…
        </span>
        <kbd className="ui-search-trigger__kbd" aria-hidden="true">
          {isMac ? "⌘" : "Ctrl"}K
        </kbd>
      </button>

      {open ? (
        <div
          className="ui-search-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <Command
            className="ui-search-palette"
            label="Site search"
            shouldFilter
          >
            <div className="ui-search-palette__inputwrap">
              <Search size={18} aria-hidden="true" />
              <Command.Input
                ref={inputRef}
                value={value}
                onValueChange={setValue}
                placeholder="Search services, case studies, blogs…"
                className="ui-search-palette__input"
              />
              <kbd
                className="ui-search-palette__esc"
                onClick={() => setOpen(false)}
              >
                ESC
              </kbd>
            </div>

            <Command.List className="ui-search-palette__list">
              <Command.Empty className="ui-search-palette__empty">
                No matches.
              </Command.Empty>

              <Command.Group
                heading="Services"
                className="ui-search-palette__group"
              >
                {hits
                  .filter((h) => h.group === "Services")
                  .map((h) => (
                    <Command.Item
                      key={h.href}
                      value={`${h.label} ${h.hint ?? ""}`}
                      onSelect={() => go(h.href)}
                      className="ui-search-palette__item"
                    >
                      <span>{h.label}</span>
                      {h.hint ? (
                        <span className="ui-search-palette__hint">
                          {h.hint}
                        </span>
                      ) : null}
                    </Command.Item>
                  ))}
              </Command.Group>

              <Command.Group
                heading="Pages"
                className="ui-search-palette__group"
              >
                {hits
                  .filter((h) => h.group === "Pages")
                  .map((h) => (
                    <Command.Item
                      key={h.href}
                      value={h.label}
                      onSelect={() => go(h.href)}
                      className="ui-search-palette__item"
                    >
                      <span>{h.label}</span>
                    </Command.Item>
                  ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      ) : null}
    </>
  );
}
