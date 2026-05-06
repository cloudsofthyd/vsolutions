// Google tag (gtag.js) — global function injected by the script in app/layout.tsx
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set" | "consent",
      action: string | Date,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

export {};
