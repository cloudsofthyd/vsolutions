# V Solutions Inc — Next.js migration + portal platform

This monorepo contains the migration from `vsolutionsinc.com` (WordPress) to a Next.js
15 + Prisma + Postgres stack, plus the foundation for a client services portal,
helpdesk, and invoicing system.

## Status

| Phase | Status | Notes |
|---|---|---|
| Discovery | ✅ | `MIGRATION_PLAN.md` |
| Project scaffold | ✅ | pnpm workspaces, Next 15, Tailwind v4 |
| Prisma schema | ✅ | 41 tables — all milestones (migration + portal + tickets + invoicing + AI + email) |
| SQL parser | ✅ | `scripts/01-parse-sql.ts`, escape-aware |
| Postgres loader | ✅ | 86 posts, 19 categories, 6 tags, 398 media, 10 menus, 146 menu items |
| Media migration | ✅ | tarball → `apps/web/public/uploads/` (148M) |
| Routing + middleware | ✅ | wp-content rewrite, wp-login redirect, signup blocked |
| Public site (homepage) | ✅ | from `vsolutions-homepage-realbrand-v2.html` |
| **URL verification** | ✅ | **108 OK / 2 redirect / 0 broken / 0 degraded** |
| **— end of Milestone 1 —** | | |
| Auth (M2) | ⏳ | wp_bcrypt verifier ready in `packages/auth`; Auth.js wiring pending |
| Admin dashboard (M2) | ⏳ | schema ready, no UI yet |
| Client portal (M2) | ⏳ | schema ready, no UI yet |
| Tickets / Invoices (M3) | ⏳ | schema ready |
| AI features / Email / Stripe (M4) | ⏳ | schema ready |

## Quickstart

```bash
# 1. Postgres + pgvector (system instance, port 5432)
sudo -u postgres psql <<EOF
CREATE ROLE vsolutions WITH LOGIN PASSWORD 'vsolutions_dev';
ALTER ROLE vsolutions CREATEDB;
CREATE DATABASE vsolutions OWNER vsolutions;
\c vsolutions
CREATE EXTENSION IF NOT EXISTS vector;
GRANT USAGE ON SCHEMA public TO vsolutions;
EOF

# 2. Install + push schema
pnpm install
pnpm db:push

# 3. Run migration end-to-end (only on a fresh DB; idempotent thereafter)
pnpm migrate:parse    # SQL → ./dump/*.json
pnpm migrate:load     # JSON → Postgres via Prisma
pnpm migrate:media    # extract uploads tarball + verify

# 4. Dev server
pnpm dev              # http://localhost:3100

# 5. Verify
pnpm migrate:verify   # → verification-report.html
```

## Environment

Copy `.env.example` to `.env`. Required for Milestone 1:

```
DATABASE_URL="postgresql://vsolutions:vsolutions_dev@127.0.0.1:5432/vsolutions?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3100"
NEXTAUTH_SECRET="..."   # only needed once auth lands in M2
```

Milestone 4 will add `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, etc.

## Layout

```
vsolutionsinc/
├── apps/
│   ├── web/                    # Next.js 15 (App Router)
│   │   ├── app/                # Routes (homepage, [...slug], service, case-study, portal, etc.)
│   │   ├── components/site/    # Header, Footer, Decorations, LatestBlog, ContactForm, ...
│   │   ├── lib/                # site config, taxonomy archive, wp-content cleanup
│   │   ├── middleware.ts       # wp-content/uploads rewrite, wp-login redirect, signup block
│   │   └── public/uploads/     # all migrated media
│   └── worker/                 # BullMQ worker (M3+)
├── packages/
│   ├── db/                     # Prisma schema + client
│   ├── auth/                   # phpass + wp_bcrypt verifiers + argon2id helpers
│   ├── ai/                     # Anthropic wrapper (M4)
│   ├── email/                  # react-email templates (M4)
│   └── pdf/                    # invoice PDF generator (M3)
├── scripts/
│   ├── 01-parse-sql.ts         # MySQL dump → JSON
│   ├── 02-load-pg.ts           # JSON → Postgres
│   ├── 03-media.ts             # tarball verify + URL sweep
│   ├── 04-verify.ts            # URL inventory walk against dev
│   └── lib/
│       ├── sql-parse.ts        # MySQL escape-aware streaming parser
│       └── php-unserialize.ts  # PHP serialize() decoder for postmeta
├── dump/                       # JSON intermediates (gitignored)
├── MIGRATION_PLAN.md           # Phase 0 discovery
└── verification-report.html    # Phase 13 output
```

## What works today (Milestone 1)

- **All 86 published posts/pages/services/case-studies/portfolios** are loaded into Postgres with original WP IDs, slugs, titles, content, featured images, Yoast SEO meta, and authors.
- **Universal permalink resolver** at `app/[...slug]/page.tsx` — any flat-URL `/{slug}/` lookup works for posts and pages, plus DB redirect fallback.
- **Dedicated routes** for `/service/[slug]/`, `/case-study/[slug]/`, `/portfolio/[slug]/`, `/category/[slug]/`, `/tag/[slug]/`, `/author/[username]/`, plus the three custom-taxonomy archives.
- **Homepage** rendered from `vsolutions-homepage-realbrand-v2.html` (CSS variables, fonts, animations) with the Latest Blog section pulling live from Postgres.
- **Middleware** rewrites `/wp-content/uploads/*` → `/uploads/*`, 301-redirects `/wp-login.php` and `/wp-admin*` to `/portal/login/`, and 302-redirects any `/portal/register/` attempt to `/portal/login/?msg=invite_only` (no public signup).
- **Sitemap, robots.txt, RSS feed** generated dynamically from DB content.
- **Contact form** at `/contact/` posting to `/api/contact/`, persisting in `ContactSubmission`.

## What is *not* done yet

Marked clearly so nobody assumes finished:

- **Auth/login is a stub** — `/portal/login/` shows a form, but the credential verification is not wired (Auth.js Credentials provider lands in M2). The `packages/auth/wp-password.ts` verifier (handles both legacy phpass and WP 6.8+ wp_bcrypt) is ready and tested.
- **No admin dashboard, client portal, ticket system, invoicing, AI, email, or payments.** All have full Prisma schemas and will plug into the foundation.
- **Elementor pages** flagged in `dump/elementor_page_ids.json` (2,042 page IDs including revisions). High-value Elementor-rendered pages that need a native rebuild:
  - About → `/about-v-solutions-inc/`
  - V-Framework → `/about-v-solutions-inc/v-framework/`
  - How we work → `/how-we-work/`
  - Service overview → `/service-overview/`
  - Pricing → `/pricing/`
  - Careers → `/careers/`
  - Most service detail pages

  The current renderer falls back to the (mostly empty) `post_content` fields. These will be reconstructed in M2 with their actual copy, mirroring the homepage's design system.

## Useful commands

```bash
# Reset migration progress (drops all data; only on dev)
sudo -u postgres psql vsolutions -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
pnpm db:push
pnpm migrate:parse && pnpm migrate:load && pnpm migrate:media

# Inspect DB
pnpm db:studio

# Re-run verification only
pnpm migrate:verify

# Type-check
pnpm --filter web typecheck
```

## Auth security note (preview, M2)

WordPress 6.8 changed the password format from classic phpass (`$P$...`) to a HMAC-SHA384 + bcrypt scheme (`$wp$2y$...`). This dump contains exactly one user with the new format. `packages/auth/wp-password.ts` handles **both** formats and silently rehashes to argon2id on first successful login (with `passwordAlgo` set to `argon2id` and `passwordHashLegacy` cleared).

## URL routing rules

| Source URL | Destination |
|---|---|
| `/` | homepage |
| `/{slug}/` | post or page |
| `/service/{slug}/` | service detail |
| `/case-study/{slug}/` | case study detail |
| `/portfolio/{slug}/` | portfolio detail |
| `/category/{slug}/`, `/tag/{slug}/`, `/author/{user}/` | archives |
| `/{taxonomy}-category/{slug}/` | custom taxonomy archive |
| `/wp-content/uploads/*` | rewrite to `/uploads/*` |
| `/wp-content/*` (non-uploads) | 404 |
| `/wp-login.php`, `/wp-admin*` | 301 → `/portal/login/` |
| `/portal/register/` | 302 → `/portal/login/?msg=invite_only` |
| `/feed/`, `/sitemap.xml`, `/robots.txt` | dynamic |
