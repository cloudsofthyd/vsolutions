import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, getClientSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Log in",
  description: "Access the V Solutions client portal.",
  alternates: { canonical: "/portal/login/" },
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ msg?: string; admin?: string; error?: string; next?: string }>;
}

const PERKS = [
  { tag: "Live", label: "Project status, in real time" },
  { tag: "Secure", label: "TLS + SSO + audit logs" },
  { tag: "Fast", label: "Tickets, invoices, files in one place" },
];

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const isInviteOnly = sp.msg === "invite_only";
  const isAdmin = sp.admin === "1";
  const error = sp.error;
  const next = sp.next || (isAdmin ? "/admin/" : "/portal/dashboard/");

  // If already logged in to the matching side, bounce them in.
  if (isAdmin) {
    const s = await getAdminSession();
    if (s) redirect(next);
  } else {
    const s = await getClientSession();
    if (s) redirect(next);
  }

  return (
    <div className={`auth-shell${isAdmin ? " auth-shell--admin" : ""}`}>
      {/* Decorative background atmosphere — same tokens as the public site */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-cloud auth-cloud--1"></div>
        <div className="auth-cloud auth-cloud--2"></div>
        <div className="auth-cloud auth-cloud--3"></div>
        <div className="auth-grid"></div>
      </div>

      {/* Left: brand showcase (hidden on small screens) */}
      <aside className="auth-showcase">
        <Link href="/" className="auth-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="V Solutions" />
          <span className="auth-brand-text">
            <strong>V Solutions Inc</strong>
            <span>{isAdmin ? "Admin Console" : "Client Portal"}</span>
          </span>
        </Link>

        <div className="auth-showcase-body">
          <div className="auth-eyebrow">
            <span className="dot"></span>
            {isAdmin ? "Admin Workspace" : "Welcome back"}
          </div>
          <h1 className="auth-title">
            {isAdmin ? (
              <>
                Run <em>operations</em>
                <br />
                with confidence.
              </>
            ) : (
              <>
                Your projects,
                <br />
                <em>at a glance.</em>
              </>
            )}
          </h1>
          <p className="auth-lede">
            {isAdmin
              ? "Real-time pulse across clients, tickets, invoices, and the contact inbox — engineered for speed."
              : "Tickets, invoices, files, and project updates — one secure dashboard, accessible from anywhere."}
          </p>

          <ul className="auth-perks">
            {PERKS.map((p) => (
              <li key={p.label}>
                <span className="perk-tag">{p.tag}</span>
                <span>{p.label}</span>
              </li>
            ))}
          </ul>

          <Link href="/" className="auth-back">
            ← Back to vsolutionsinc.com
          </Link>
        </div>
      </aside>

      {/* Right: login card */}
      <main className="auth-stage">
        <div className="auth-card">
          <div className="auth-card-glow" aria-hidden="true"></div>

          <Link href="/" className="auth-card-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="V Solutions" />
          </Link>

          <div className="auth-tabs">
            <Link
              href={`/portal/login/${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className={`auth-tab${!isAdmin ? " is-active" : ""}`}
            >
              Client
            </Link>
            <Link
              href={`/portal/login/?admin=1${next ? `&next=${encodeURIComponent(next)}` : ""}`}
              className={`auth-tab${isAdmin ? " is-active" : ""}`}
            >
              Admin
            </Link>
          </div>

          <h2 className="auth-card-title">
            {isAdmin ? (
              <>
                Sign in to <em>Admin.</em>
              </>
            ) : (
              <>
                Sign in to <em>your portal.</em>
              </>
            )}
          </h2>
          <p className="auth-card-sub">
            {isAdmin
              ? "Operations dashboard, tickets, invoicing, and content."
              : "Track projects, raise tickets, and view invoices."}
          </p>

          {isInviteOnly && (
            <div className="auth-flash">
              Accounts are created by an admin only — please contact your account manager.
            </div>
          )}
          {error && <div className="auth-flash auth-flash--error">{error}</div>}

          <form className="auth-form" action="/api/auth/login/" method="post">
            <input type="hidden" name="mode" value={isAdmin ? "admin" : "client"} />
            <input type="hidden" name="next" value={next} />

            <label>
              <span>Email</span>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">✉</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoFocus
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </div>
            </label>

            <label>
              <span>
                Password
                <Link href="/portal/reset/" className="auth-forgot">
                  Forgot?
                </Link>
              </span>
              <div className="input-wrap">
                <span className="input-icon" aria-hidden="true">🔒</span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button type="submit" className="btn btn-primary auth-submit">
              {isAdmin ? "Sign in to admin" : "Sign in"}
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <div className="auth-divider"><span>Demo accounts</span></div>

          <div className="auth-demo">
            <button
              type="button"
              className="auth-demo-row"
              data-mode="admin"
              data-email="admin@vsolutionsinc.com"
              data-password="VSolutions@2026"
            >
              <span className="role role--admin">Admin</span>
              <code>admin@vsolutionsinc.com</code>
              <span className="copy">tap to fill →</span>
            </button>
            <button
              type="button"
              className="auth-demo-row"
              data-mode="client"
              data-email="owner@acmecorp.demo"
              data-password="Client@2026"
            >
              <span className="role role--client">Client</span>
              <code>owner@acmecorp.demo</code>
              <span className="copy">tap to fill →</span>
            </button>
          </div>
        </div>

        <p className="auth-foot">
          © {new Date().getFullYear()} V Solutions Inc · <Link href="/privacy-policy/">Privacy</Link> ·{" "}
          <Link href="/terms-and-conditions/">Terms</Link>
        </p>
      </main>

      {/* Demo-account "tap to fill" wiring (no React state needed) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              document.querySelectorAll('.auth-demo-row').forEach(function(btn){
                btn.addEventListener('click', function(){
                  var em = btn.getAttribute('data-email');
                  var pw = btn.getAttribute('data-password');
                  var mode = btn.getAttribute('data-mode');
                  var form = document.querySelector('.auth-form');
                  if (!form) return;
                  var emEl = form.querySelector('input[name=email]');
                  var pwEl = form.querySelector('input[name=password]');
                  var modeEl = form.querySelector('input[name=mode]');
                  if (emEl) emEl.value = em;
                  if (pwEl) pwEl.value = pw;
                  if (modeEl) modeEl.value = mode;
                  if (pwEl) pwEl.focus();
                });
              });
            })();
          `,
        }}
      />
    </div>
  );
}
