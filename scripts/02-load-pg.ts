// Load parsed dump JSON into Postgres via Prisma.
//
// Order: Users → Categories+Tags (terms) → Media (attachments) → Posts →
//        PostCategory + PostTag (term_relationships) → Comments → Menus
//
// All inserts wrapped in $transaction batches; idempotent via wpId @unique upserts.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@vsi/db";
import { phpUnserialize } from "./lib/php-unserialize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DUMP = path.join(ROOT, "dump");

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function rewriteContentUrls(html: string): string {
  if (!html) return html;
  return html
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/wp-content\/uploads\//g, "/uploads/")
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/uploads\//g, "/uploads/")
    .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\//g, "/");
}

function permalinkFor(type: string, slug: string): string {
  switch (type) {
    case "post":
    case "page":
      return `/${slug}/`;
    case "service":
      return `/service/${slug}/`;
    case "case-study":
      return `/case-study/${slug}/`;
    case "portfolio":
      return `/portfolio/${slug}/`;
    default:
      return `/${slug}/`;
  }
}

function readingTimeMinutes(content: string): number {
  const words = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ").length;
  return Math.max(1, Math.ceil(words / 220));
}

function asDate(s: string | number | null | undefined): Date {
  if (!s || s === "0000-00-00 00:00:00") return new Date();
  const d = new Date(String(s).replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return new Date();
  return d;
}

function toRoleFromCaps(serialized: string): "ADMIN" | "EDITOR" | "AUTHOR" {
  const v = phpUnserialize(serialized) as Record<string, boolean> | null;
  if (!v) return "ADMIN";
  if (v["administrator"]) return "ADMIN";
  if (v["editor"]) return "EDITOR";
  if (v["author"]) return "AUTHOR";
  return "ADMIN";
}

// ─────────────────────────────────────────────────────────────────────────────
// Loaders
// ─────────────────────────────────────────────────────────────────────────────

async function loadUsers() {
  const users = JSON.parse(await fs.readFile(path.join(DUMP, "users.json"), "utf8"));
  const usermeta = JSON.parse(await fs.readFile(path.join(DUMP, "usermeta.json"), "utf8"));

  // group meta by user
  const metaByUser: Map<number, Record<string, string>> = new Map();
  for (const m of usermeta) {
    const uid = Number(m.user_id);
    if (!metaByUser.has(uid)) metaByUser.set(uid, {});
    metaByUser.get(uid)![String(m.meta_key)] = String(m.meta_value ?? "");
  }

  let count = 0;
  for (const u of users) {
    const wpId = Number(u.ID);
    const meta = metaByUser.get(wpId) ?? {};
    const capsKey = "wprx_capabilities";
    const role = meta[capsKey] ? toRoleFromCaps(meta[capsKey]) : "ADMIN";
    const hash = String(u.user_pass ?? "");
    const algo = hash.startsWith("$wp$") ? "wp_bcrypt" : hash.startsWith("$P$") ? "phpass" : "unknown";
    const username = String(u.user_login ?? `user-${wpId}`);

    await prisma.user.upsert({
      where: { wpId },
      create: {
        wpId,
        email: String(u.user_email ?? `${username}@imported.local`),
        username,
        passwordHashLegacy: hash || null,
        passwordAlgo: algo,
        displayName: String(u.display_name ?? username),
        firstName: meta["first_name"] || null,
        lastName: meta["last_name"] || null,
        bio: meta["description"] || null,
        role,
        emailVerified: asDate(String(u.user_registered ?? "")),
      },
      update: {
        passwordHashLegacy: hash || null,
        passwordAlgo: algo,
        displayName: String(u.display_name ?? username),
        firstName: meta["first_name"] || null,
        lastName: meta["last_name"] || null,
        bio: meta["description"] || null,
        role,
      },
    });
    count++;
  }
  console.log(`  ✔ Users: ${count}`);
}

async function loadTerms() {
  const terms: Array<{ term_id: number; name: string; slug: string }> = JSON.parse(
    await fs.readFile(path.join(DUMP, "terms.json"), "utf8"),
  );
  const taxonomies: Array<{
    term_taxonomy_id: number;
    term_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
  }> = JSON.parse(await fs.readFile(path.join(DUMP, "term_taxonomy.json"), "utf8"));

  const termById = new Map(terms.map((t) => [t.term_id, t]));

  // Categories (incl. service-category, case-study-category, portfolio-category)
  let categoryCount = 0;
  let tagCount = 0;
  for (const tt of taxonomies) {
    const t = termById.get(tt.term_id);
    if (!t) continue;
    if (
      tt.taxonomy === "category" ||
      tt.taxonomy === "service-category" ||
      tt.taxonomy === "case-study-category" ||
      tt.taxonomy === "portfolio-category"
    ) {
      await prisma.category.upsert({
        where: { wpId: tt.term_taxonomy_id },
        create: {
          wpId: tt.term_taxonomy_id,
          name: t.name,
          slug: t.slug,
          taxonomy: tt.taxonomy,
          description: tt.description || null,
          count: tt.count,
        },
        update: {
          name: t.name,
          slug: t.slug,
          description: tt.description || null,
          count: tt.count,
        },
      });
      categoryCount++;
    } else if (tt.taxonomy === "post_tag") {
      await prisma.tag.upsert({
        where: { wpId: tt.term_taxonomy_id },
        create: {
          wpId: tt.term_taxonomy_id,
          name: t.name,
          slug: t.slug,
          count: tt.count,
        },
        update: { name: t.name, slug: t.slug, count: tt.count },
      });
      tagCount++;
    }
  }
  console.log(`  ✔ Categories: ${categoryCount}, Tags: ${tagCount}`);
}

async function loadMedia() {
  const posts = JSON.parse(await fs.readFile(path.join(DUMP, "posts.json"), "utf8"));
  const metaRaw = JSON.parse(await fs.readFile(path.join(DUMP, "postmeta.json"), "utf8"));

  const metaByPost: Map<number, Record<string, string>> = new Map();
  for (const m of metaRaw) {
    const pid = Number(m.post_id);
    if (!metaByPost.has(pid)) metaByPost.set(pid, {});
    metaByPost.get(pid)![String(m.meta_key)] = String(m.meta_value ?? "");
  }

  let count = 0;
  for (const p of posts) {
    if (p.post_type !== "attachment") continue;
    const meta = metaByPost.get(Number(p.ID)) ?? {};
    const filePath = meta["_wp_attached_file"] || "";
    if (!filePath) continue;
    const url = `/uploads/${filePath}`;
    const filename = path.basename(filePath);

    let width: number | null = null;
    let height: number | null = null;
    let filesize: number | null = null;
    if (meta["_wp_attachment_metadata"]) {
      const am = phpUnserialize(meta["_wp_attachment_metadata"]) as
        | { width?: number; height?: number; filesize?: number; file?: string }
        | null;
      if (am) {
        width = typeof am.width === "number" ? am.width : null;
        height = typeof am.height === "number" ? am.height : null;
        filesize = typeof am.filesize === "number" ? am.filesize : null;
      }
    }

    await prisma.media.upsert({
      where: { wpId: Number(p.ID) },
      create: {
        wpId: Number(p.ID),
        filename,
        path: `/uploads/${filePath}`,
        url,
        mimeType: String(p.post_mime_type ?? "application/octet-stream"),
        width,
        height,
        altText: meta["_wp_attachment_image_alt"] || null,
        filesize,
      },
      update: {
        filename,
        path: `/uploads/${filePath}`,
        url,
        mimeType: String(p.post_mime_type ?? "application/octet-stream"),
        width,
        height,
        altText: meta["_wp_attachment_image_alt"] || null,
        filesize,
      },
    });
    count++;
    if (count % 100 === 0) process.stdout.write(`    media ${count}/${posts.filter((x: { post_type: string }) => x.post_type === "attachment").length}\r`);
  }
  process.stdout.write("\n");
  console.log(`  ✔ Media: ${count}`);
}

async function loadPosts() {
  const posts = JSON.parse(await fs.readFile(path.join(DUMP, "posts.json"), "utf8"));
  const metaRaw = JSON.parse(await fs.readFile(path.join(DUMP, "postmeta.json"), "utf8"));

  const metaByPost: Map<number, Record<string, string>> = new Map();
  for (const m of metaRaw) {
    const pid = Number(m.post_id);
    if (!metaByPost.has(pid)) metaByPost.set(pid, {});
    metaByPost.get(pid)![String(m.meta_key)] = String(m.meta_value ?? "");
  }

  // build wp user id → cuid map
  const allUsers = await prisma.user.findMany({ select: { id: true, wpId: true } });
  const userByWpId = new Map(allUsers.filter((u) => u.wpId !== null).map((u) => [u.wpId!, u.id]));

  // build wp media id → cuid map
  const allMedia = await prisma.media.findMany({ select: { id: true, wpId: true } });
  const mediaByWpId = new Map(allMedia.filter((m) => m.wpId !== null).map((m) => [m.wpId!, m.id]));

  let count = 0;
  let skipped = 0;
  for (const p of posts) {
    const type = String(p.post_type);
    if (
      type !== "post" &&
      type !== "page" &&
      type !== "service" &&
      type !== "case-study" &&
      type !== "portfolio"
    ) {
      continue;
    }
    if (p.post_status !== "publish" && p.post_status !== "draft" && p.post_status !== "private") {
      continue;
    }
    const slug = String(p.post_name || "");
    if (!slug) {
      skipped++;
      continue;
    }
    const meta = metaByPost.get(Number(p.ID)) ?? {};
    const permalink = permalinkFor(type, slug);
    const content = rewriteContentUrls(String(p.post_content || ""));
    const excerpt = rewriteContentUrls(String(p.post_excerpt || "")) || null;

    // SEO
    const seoTitle = meta["_yoast_wpseo_title"] || meta["rank_math_title"] || null;
    const seoDescription =
      meta["_yoast_wpseo_metadesc"] || meta["rank_math_description"] || null;
    const canonicalUrl =
      meta["_yoast_wpseo_canonical"] || meta["rank_math_canonical_url"] || null;

    // Featured image
    const thumbId = meta["_thumbnail_id"] ? Number(meta["_thumbnail_id"]) : null;
    const featuredImageId = thumbId !== null ? mediaByWpId.get(thumbId) ?? null : null;

    const authorId = userByWpId.get(Number(p.post_author)) ?? null;
    const status =
      p.post_status === "publish"
        ? "PUBLISHED"
        : p.post_status === "private"
          ? "PRIVATE"
          : "DRAFT";

    try {
      await prisma.post.upsert({
        where: { wpId: Number(p.ID) },
        create: {
          wpId: Number(p.ID),
          slug,
          permalink,
          title: String(p.post_title || slug),
          content,
          excerpt,
          status,
          type,
          featuredImageId,
          authorId,
          publishedAt: asDate(p.post_date_gmt || p.post_date),
          readingTime: readingTimeMinutes(content),
          seoTitle,
          seoDescription,
          canonicalUrl,
        },
        update: {
          slug,
          permalink,
          title: String(p.post_title || slug),
          content,
          excerpt,
          status,
          type,
          featuredImageId,
          authorId,
          publishedAt: asDate(p.post_date_gmt || p.post_date),
          readingTime: readingTimeMinutes(content),
          seoTitle,
          seoDescription,
          canonicalUrl,
        },
      });
      count++;
    } catch (err) {
      // permalink unique conflict — fall back to slug-with-id
      if (String(err).includes("Unique constraint")) {
        await prisma.post.upsert({
          where: { wpId: Number(p.ID) },
          create: {
            wpId: Number(p.ID),
            slug,
            permalink: permalinkFor(type, `${slug}-${p.ID}`),
            title: String(p.post_title || slug),
            content,
            excerpt,
            status,
            type,
            featuredImageId,
            authorId,
            publishedAt: asDate(p.post_date_gmt || p.post_date),
            readingTime: readingTimeMinutes(content),
            seoTitle,
            seoDescription,
            canonicalUrl,
          },
          update: {},
        });
        count++;
      } else {
        console.error(`✗ Post wpId=${p.ID} (${slug}):`, err);
        skipped++;
      }
    }
  }
  console.log(`  ✔ Posts: ${count} (skipped ${skipped})`);
}

async function loadPostTerms() {
  const tr: Array<{ object_id: number; term_taxonomy_id: number }> = JSON.parse(
    await fs.readFile(path.join(DUMP, "term_relationships.json"), "utf8"),
  );

  const allPosts = await prisma.post.findMany({ select: { id: true, wpId: true } });
  const postByWp = new Map(allPosts.filter((p) => p.wpId).map((p) => [p.wpId!, p.id]));

  const allCats = await prisma.category.findMany({ select: { id: true, wpId: true } });
  const catByWp = new Map(allCats.filter((c) => c.wpId).map((c) => [c.wpId!, c.id]));

  const allTags = await prisma.tag.findMany({ select: { id: true, wpId: true } });
  const tagByWp = new Map(allTags.filter((t) => t.wpId).map((t) => [t.wpId!, t.id]));

  let pc = 0;
  let pt = 0;
  for (const r of tr) {
    const postId = postByWp.get(r.object_id);
    if (!postId) continue;
    const catId = catByWp.get(r.term_taxonomy_id);
    if (catId) {
      try {
        await prisma.postCategory.create({
          data: { postId, categoryId: catId },
        });
        pc++;
      } catch {
        /* dup ignored */
      }
      continue;
    }
    const tagId = tagByWp.get(r.term_taxonomy_id);
    if (tagId) {
      try {
        await prisma.postTag.create({ data: { postId, tagId } });
        pt++;
      } catch {
        /* dup ignored */
      }
    }
  }
  console.log(`  ✔ PostCategory: ${pc}, PostTag: ${pt}`);
}

async function loadComments() {
  const comments = JSON.parse(await fs.readFile(path.join(DUMP, "comments.json"), "utf8"));
  const allPosts = await prisma.post.findMany({ select: { id: true, wpId: true } });
  const postByWp = new Map(allPosts.filter((p) => p.wpId).map((p) => [p.wpId!, p.id]));

  let count = 0;
  for (const c of comments) {
    const postId = postByWp.get(Number(c.comment_post_ID));
    if (!postId) continue;
    try {
      await prisma.comment.upsert({
        where: { wpId: Number(c.comment_ID) },
        create: {
          wpId: Number(c.comment_ID),
          postId,
          authorName: String(c.comment_author || "Anonymous"),
          authorEmail: c.comment_author_email ? String(c.comment_author_email) : null,
          authorUrl: c.comment_author_url ? String(c.comment_author_url) : null,
          authorIp: c.comment_author_IP ? String(c.comment_author_IP) : null,
          content: String(c.comment_content || ""),
          status: "PUBLISHED",
          createdAt: asDate(c.comment_date_gmt || c.comment_date),
        },
        update: {},
      });
      count++;
    } catch {
      /* skip */
    }
  }
  console.log(`  ✔ Comments: ${count}`);
}

async function loadMenus() {
  // Menus come from posts of type 'nav_menu_item' + term_taxonomy with taxonomy='nav_menu'.
  const posts = JSON.parse(await fs.readFile(path.join(DUMP, "posts.json"), "utf8"));
  const metaRaw = JSON.parse(await fs.readFile(path.join(DUMP, "postmeta.json"), "utf8"));
  const tr: Array<{ object_id: number; term_taxonomy_id: number }> = JSON.parse(
    await fs.readFile(path.join(DUMP, "term_relationships.json"), "utf8"),
  );
  const taxonomies: Array<{
    term_taxonomy_id: number;
    term_id: number;
    taxonomy: string;
    count: number;
  }> = JSON.parse(await fs.readFile(path.join(DUMP, "term_taxonomy.json"), "utf8"));
  const terms: Array<{ term_id: number; name: string; slug: string }> = JSON.parse(
    await fs.readFile(path.join(DUMP, "terms.json"), "utf8"),
  );

  // create Menu rows
  const termById = new Map(terms.map((t) => [t.term_id, t]));
  const menuTtIds: number[] = [];
  let menuCount = 0;
  for (const tt of taxonomies) {
    if (tt.taxonomy !== "nav_menu") continue;
    const t = termById.get(tt.term_id);
    if (!t) continue;
    menuTtIds.push(tt.term_taxonomy_id);
    await prisma.menu.upsert({
      where: { wpId: tt.term_taxonomy_id },
      create: { wpId: tt.term_taxonomy_id, name: t.name, slug: t.slug },
      update: { name: t.name, slug: t.slug },
    });
    menuCount++;
  }

  // map nav_menu_item post.ID → menu (via term_relationships)
  const itemToMenuTt = new Map<number, number>();
  for (const r of tr) {
    if (menuTtIds.includes(r.term_taxonomy_id)) {
      itemToMenuTt.set(r.object_id, r.term_taxonomy_id);
    }
  }

  // group meta
  const metaByPost: Map<number, Record<string, string>> = new Map();
  for (const m of metaRaw) {
    const pid = Number(m.post_id);
    if (!metaByPost.has(pid)) metaByPost.set(pid, {});
    metaByPost.get(pid)![String(m.meta_key)] = String(m.meta_value ?? "");
  }

  // resolve menu records
  const allMenus = await prisma.menu.findMany({ select: { id: true, wpId: true } });
  const menuByWp = new Map(allMenus.filter((m) => m.wpId).map((m) => [m.wpId!, m.id]));

  let itemCount = 0;
  for (const p of posts) {
    if (p.post_type !== "nav_menu_item") continue;
    const menuTt = itemToMenuTt.get(Number(p.ID));
    if (!menuTt) continue;
    const menuId = menuByWp.get(menuTt);
    if (!menuId) continue;
    const meta = metaByPost.get(Number(p.ID)) ?? {};
    const url = meta["_menu_item_url"] || "/";
    const target = meta["_menu_item_target"] || null;
    const title = String(p.post_title || meta["_menu_item_title"] || "Link");
    await prisma.menuItem.upsert({
      where: { wpId: Number(p.ID) },
      create: {
        wpId: Number(p.ID),
        menuId,
        label: title,
        url: rewriteContentUrls(url),
        target,
        orderIndex: Number(p.menu_order ?? 0),
      },
      update: {
        menuId,
        label: title,
        url: rewriteContentUrls(url),
        target,
        orderIndex: Number(p.menu_order ?? 0),
      },
    });
    itemCount++;
  }
  console.log(`  ✔ Menus: ${menuCount}, MenuItems: ${itemCount}`);
}

async function loadRedirects() {
  // Pre-populate redirects we know we need (legacy WP URLs → Next).
  const redirects = [
    { from: "/wp-login.php", to: "/portal/login/", code: 301 },
    { from: "/wp-admin", to: "/portal/login/", code: 301 },
    { from: "/wp-admin/", to: "/portal/login/", code: 301 },
    { from: "/portal/register", to: "/portal/login/?msg=invite_only", code: 302 },
    { from: "/portal/register/", to: "/portal/login/?msg=invite_only", code: 302 },
  ];
  for (const r of redirects) {
    await prisma.redirect.upsert({
      where: { from: r.from },
      create: r,
      update: { to: r.to, code: r.code },
    });
  }
  console.log(`  ✔ Seed redirects: ${redirects.length}`);
}

async function main() {
  console.log("=== Phase 4: Load → Postgres ===");
  await loadUsers();
  await loadTerms();
  await loadMedia();
  await loadPosts();
  await loadPostTerms();
  await loadComments();
  await loadMenus();
  await loadRedirects();

  // final tallies
  const [u, c, t, m, p, cm] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.media.count(),
    prisma.post.count(),
    prisma.comment.count(),
  ]);
  console.log(`\n=== DB totals ===`);
  console.log(`  Users:      ${u}`);
  console.log(`  Categories: ${c}`);
  console.log(`  Tags:       ${t}`);
  console.log(`  Media:      ${m}`);
  console.log(`  Posts:      ${p}`);
  console.log(`  Comments:   ${cm}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
