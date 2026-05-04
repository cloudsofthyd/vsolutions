# V Solutions Inc — WordPress → Next.js Migration Plan

Generated 2026-04-30. Source dump: `vsolutionsinc_wp293new.sql`.

## Source environment

| Property | Value |
|---|---|
| WordPress table prefix | `wprx_` |
| MariaDB version | 11.4.7 |
| WP permalink structure | `/%postname%/` (flat slug URLs) |
| Active theme | `consultio` |
| Page builder | Elementor + ElementsKit |
| Slider plugin | Smart Slider 3 (Nextend) |
| SEO plugin | Yoast (`wpseo`) |
| Cache plugin | LiteSpeed |
| Calendars plugin | Booked |
| Total INSERT statements | 3,329 |
| Media files in tarball | 2,221 |

## Content inventory (from `wprx_posts`)

| post_type | Count | Migration handling |
|---|---|---|
| revision | 2,039 | **Skip** (post revisions, not needed) |
| attachment | 398 | → `Media` table |
| page | 223 | → `Post` (type=page) |
| nav_menu_item | 147 | → `Menu` / `MenuItem` |
| post | 116 | → `Post` (type=post, blog) |
| portfolio | 28 | → `Post` (type=portfolio) — store under `/portfolio/{slug}/` |
| service | 20 | → `Post` (type=service) — `/service/{slug}/` |
| case-study | 11 | → `Post` (type=case-study) — `/case-study/{slug}/` |
| ct-mega-menu | 5 | Skip (theme-only menu builder data) |
| footer | 3 | Skip (theme-only Elementor footer templates) |
| page-title | 1 | Skip (theme template) |
| header | 1 | Skip (theme template) |

## Users

- **1 user** in `wprx_users` (the admin).
- Password hash format: **WordPress 6.8+ `$wp$2y$10$...`** (HMAC-SHA384 wrapper + bcrypt), NOT classic phpass `$P$`.
- Will support both formats in `packages/auth/wp-password.ts` (verify → silent argon2id rehash).

## URL inventory rules

| Source pattern | Next.js destination |
|---|---|
| `/` | homepage |
| `/{slug}/` (flat) | post or page lookup by `permalink` |
| `/service/{slug}/` | service detail |
| `/case-study/{slug}/` | case-study detail |
| `/portfolio/{slug}/` | portfolio detail |
| `/category/{slug}/` | category archive |
| `/tag/{slug}/` | tag archive |
| `/author/{username}/` | author archive |
| `/wp-content/uploads/{path}` | rewrite to `/uploads/{path}` |
| `/wp-login.php`, `/wp-admin*` | 301 → `/portal/login/` |
| `/portal/register/` | 302 → `/portal/login/?msg=invite_only` (signup disabled) |
| `/feed/`, `/sitemap.xml`, `/robots.txt` | dynamic |

## Brand palette (extracted from `vsolutions-homepage-realbrand-v2.html`)

```
--rose:        #F2295B   (primary CTA)
--rose-soft:   #FF5E84
--rose-deep:   #D11947
--sky:         #3B82F6
--cyan:        #06B6D4
--indigo:      #6366F1
--navy:        #0E1B3A   (header)
--bg:          #F4F8FF   (page background)
--ink:         #0E1B3A
```

Fonts: `Plus Jakarta Sans`, `Instrument Serif`, `JetBrains Mono` (Google Fonts).

## Database

- Local Postgres 16 (system instance) at `127.0.0.1:5432/vsolutions`
- User `vsolutions` / pw `vsolutions_dev`
- Extensions: `vector` 0.6.0 (pgvector)

## Risk callouts

1. **Elementor pages**: Pages built with Elementor store rendered HTML in `post_content` AND structured JSON in `_elementor_data` postmeta. We migrate the rendered HTML; pages where `post_content` is empty/minimal will be flagged in `MIGRATION_LOG.md` for manual rebuild. Practically, the high-value pages (home, services, case studies) will be rebuilt as native React components (Phase 7).
2. **Smart Slider 3**: Slider markup likely lives in shortcodes (`[smartslider3 ...]`) inside Elementor. Slider content does not survive shortcode → React conversion. Hero slider will be rebuilt natively from the homepage HTML design.
3. **Booked plugin**: Calendar functionality won't migrate — replaced by the helpdesk system in Milestone 2+.
4. **Single user**: Only 1 admin to migrate, so phpass upgrade testing must be done carefully (don't lock out the live admin during migration).

## Execution roadmap

This session (Milestone 1):
- Phase 1 — Project scaffold
- Phase 2 — Full Prisma schema (covers all 15 phases)
- Phase 3 — SQL parser
- Phase 4 — Postgres loader
- Phase 5 — Media migration
- Phase 6 — Routing + middleware
- Phase 7 — Public site
- Phase 13 — Verification

Subsequent sessions:
- M2: Auth (phpass upgrade) + admin shell + client model CRUD
- M3: Tickets + invoices
- M4: AI features + email + Stripe/Razorpay payments + production polish
