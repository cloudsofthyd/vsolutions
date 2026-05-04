"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "err";

export function ContactForm() {
  const [state, setState] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong, please try again.");
      }
      setState("ok");
      form.reset();
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="contact-success">
        <div className="contact-success-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3>Message received.</h3>
        <p>
          Thanks for reaching out — a real human from our team will reply within
          one business day.
        </p>
        <button
          type="button"
          className="btn btn-ghost contact-success-again"
          onClick={() => setState("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-form-cool" noValidate>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="contact-honeypot"
      />

      <div className="contact-form-row">
        <FloatField name="name" label="Your name" type="text" required minLength={2} />
        <FloatField name="email" label="Email address" type="email" required />
      </div>

      <FloatField name="phone" label="Mobile number (optional)" type="tel" />

      <FloatField
        name="message"
        label="How can we help? (optional)"
        textarea
      />

      {state === "err" && (
        <p className="form-error" role="alert">
          {errMsg}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary contact-submit"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? (
          <>
            <span className="spinner" aria-hidden />
            Sending…
          </>
        ) : (
          <>
            Send message
            <span className="btn-arrow">→</span>
          </>
        )}
      </button>

      <p className="contact-form-disclaim">
        We respect your privacy. No third-party tracking — your message goes
        straight to our team at <strong>info@vsolutionsinc.com</strong>.
      </p>
    </form>
  );
}

interface FloatFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  textarea?: boolean;
}

function FloatField({
  name,
  label,
  type = "text",
  required = false,
  minLength,
  textarea = false,
}: FloatFieldProps) {
  return (
    <label className="float-field">
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          required={required}
          minLength={minLength}
          placeholder=" "
          aria-label={label}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          minLength={minLength}
          placeholder=" "
          autoComplete={
            name === "email"
              ? "email"
              : name === "name"
                ? "name"
                : name === "phone"
                  ? "tel"
                  : "off"
          }
          aria-label={label}
        />
      )}
      <span className="float-label">
        {label}
        {required ? <span className="float-required" aria-hidden>*</span> : null}
      </span>
    </label>
  );
}
