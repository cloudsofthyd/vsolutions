"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, website }),
      });
      const data: { ok?: boolean; alreadySubscribed?: boolean; error?: string } =
        await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "Couldn't subscribe — please try again.");
        return;
      }
      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already on the list — thanks again."
          : "Subscribed. Check your inbox for a welcome note.",
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} aria-label="Newsletter signup">
      <div className="newsletter-eyebrow">— Stay in the loop</div>
      <h4 className="newsletter-title">
        Monthly insights, <em>zero spam.</em>
      </h4>
      <p className="newsletter-sub">
        AI, cloud, DevOps, cybersecurity, and growth notes — straight from our engineers.
      </p>

      <div className="newsletter-field">
        <label className="visually-hidden" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          required
        />
        {/* Honeypot — visually hidden, bots fill it */}
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <button
          type="submit"
          className="newsletter-submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <span className="newsletter-spinner" aria-hidden />
          ) : status === "success" ? (
            <span className="newsletter-check" aria-hidden>✓</span>
          ) : (
            <span className="newsletter-arrow" aria-hidden>→</span>
          )}
        </button>
      </div>

      {message && (
        <p
          className={`newsletter-msg newsletter-msg-${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}

      <p className="newsletter-fineprint">
        By subscribing you agree to our{" "}
        <a href="/privacy-policy/">privacy policy</a>. Unsubscribe anytime.
      </p>
    </form>
  );
}
