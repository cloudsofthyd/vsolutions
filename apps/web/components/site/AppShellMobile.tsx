"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Mobile drawer toggle for the admin/portal AppShell.
 * Renders a hamburger button + a backdrop. State is held here, applied to
 * the parent <div class="app-shell"> via the `data-drawer="open"` attribute.
 */
export function AppShellMobileToggle({ brand }: { brand: { mark: string; label: string; sub: string } }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.classList.add("drawer-open");
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("drawer-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // sync to .app-shell ancestor
  useEffect(() => {
    const shell = document.querySelector(".app-shell");
    if (!shell) return;
    if (open) shell.setAttribute("data-drawer", "open");
    else shell.removeAttribute("data-drawer");
  }, [open]);

  return (
    <>
      <header className="app-topbar" role="banner">
        <button
          type="button"
          className="app-hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="app-topbar-brand">
          <span className="app-brand-mark app-brand-mark--sm" aria-hidden="true">
            {brand.mark}
          </span>
          <span className="app-topbar-label">{brand.label}</span>
        </div>
      </header>
      <div
        className="app-drawer-backdrop"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
