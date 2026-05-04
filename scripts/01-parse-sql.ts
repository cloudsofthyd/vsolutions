// Stream-parse the WordPress MySQL dump → JSON files in ./dump/.
// Outputs:
//   posts.json, postmeta.json, terms.json, term_taxonomy.json, term_relationships.json,
//   users.json, usermeta.json, comments.json, options.json, url-inventory.json
//
// We filter rows aggressively: skip post revisions, theme template post types, etc.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { streamMysqlDump, rowToObj } from "./lib/sql-parse.js";
import { phpUnserialize } from "./lib/php-unserialize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SQL_FILE = path.join(ROOT, "vsolutionsinc_wp293new.sql");
const OUT_DIR = path.join(ROOT, "dump");

const PREFIX = "wprx_";
const TABLES = {
  posts: `${PREFIX}posts`,
  postmeta: `${PREFIX}postmeta`,
  terms: `${PREFIX}terms`,
  termTaxonomy: `${PREFIX}term_taxonomy`,
  termRelationships: `${PREFIX}term_relationships`,
  users: `${PREFIX}users`,
  usermeta: `${PREFIX}usermeta`,
  comments: `${PREFIX}comments`,
  options: `${PREFIX}options`,
};

const KEEP_POST_TYPES = new Set([
  "post",
  "page",
  "attachment",
  "nav_menu_item",
  "service",
  "case-study",
  "portfolio",
]);

const KEEP_OPTIONS = new Set([
  "siteurl",
  "home",
  "blogname",
  "blogdescription",
  "permalink_structure",
  "category_base",
  "tag_base",
  "default_category",
  "template",
  "stylesheet",
  "show_on_front",
  "page_on_front",
  "page_for_posts",
]);

interface PostRow {
  ID: number;
  post_author: number;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string | null;
  post_status: string;
  post_password: string | null;
  post_name: string;
  post_modified: string;
  post_modified_gmt: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string | null;
  comment_count: number;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const posts: PostRow[] = [];
  const postmeta: Array<{ post_id: number; meta_key: string; meta_value: string }> = [];
  const terms: Array<{ term_id: number; name: string; slug: string }> = [];
  const termTaxonomy: Array<{
    term_taxonomy_id: number;
    term_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
  }> = [];
  const termRelationships: Array<{
    object_id: number;
    term_taxonomy_id: number;
  }> = [];
  const users: Array<Record<string, string | number | null>> = [];
  const usermeta: Array<Record<string, string | number | null>> = [];
  const comments: Array<Record<string, string | number | null>> = [];
  const options: Array<{ name: string; value: unknown }> = [];
  const elementorPageIds = new Set<number>();

  const wantedTables = new Set(Object.values(TABLES));

  let scanned = 0;
  const stats = await streamMysqlDump(SQL_FILE, wantedTables, async (stmt) => {
    for (const row of stmt.rows) {
      scanned++;
      if (scanned % 1000 === 0) {
        process.stdout.write(`  scanned ${scanned} rows...\r`);
      }
      const obj = rowToObj(stmt, row);
      switch (stmt.table) {
        case TABLES.posts: {
          const t = String(obj.post_type ?? "");
          if (!KEEP_POST_TYPES.has(t)) continue;
          const status = String(obj.post_status ?? "");
          if (!["publish", "private", "inherit", "draft"].includes(status)) continue;
          posts.push(obj as unknown as PostRow);
          break;
        }
        case TABLES.postmeta: {
          const k = String(obj.meta_key ?? "");
          // Skip Elementor's huge JSON blobs — pages will be rebuilt natively.
          // Track only the page IDs that have Elementor data so we can flag them.
          if (k === "_elementor_data" || k === "_elementor_page_settings" || k === "_elementor_css") {
            elementorPageIds.add(Number(obj.post_id));
            break;
          }
          // Keep only the keys we actually use
          if (
            k.startsWith("_yoast_") ||
            k.startsWith("rank_math_") ||
            k.startsWith("_menu_item_") ||
            k === "_thumbnail_id" ||
            k === "_wp_attached_file" ||
            k === "_wp_attachment_metadata" ||
            k === "_wp_attachment_image_alt"
          ) {
            postmeta.push({
              post_id: Number(obj.post_id),
              meta_key: k,
              meta_value: String(obj.meta_value ?? ""),
            });
          }
          break;
        }
        case TABLES.terms: {
          terms.push({
            term_id: Number(obj.term_id),
            name: String(obj.name ?? ""),
            slug: String(obj.slug ?? ""),
          });
          break;
        }
        case TABLES.termTaxonomy: {
          termTaxonomy.push({
            term_taxonomy_id: Number(obj.term_taxonomy_id),
            term_id: Number(obj.term_id),
            taxonomy: String(obj.taxonomy ?? ""),
            description: String(obj.description ?? ""),
            parent: Number(obj.parent ?? 0),
            count: Number(obj.count ?? 0),
          });
          break;
        }
        case TABLES.termRelationships: {
          termRelationships.push({
            object_id: Number(obj.object_id),
            term_taxonomy_id: Number(obj.term_taxonomy_id),
          });
          break;
        }
        case TABLES.users: {
          users.push(obj);
          break;
        }
        case TABLES.usermeta: {
          const k = String(obj.meta_key ?? "");
          if (
            k === `${PREFIX}capabilities` ||
            k === `${PREFIX}user_level` ||
            k === "first_name" ||
            k === "last_name" ||
            k === "description" ||
            k === "nickname"
          ) {
            usermeta.push(obj);
          }
          break;
        }
        case TABLES.comments: {
          if (String(obj.comment_approved ?? "") === "1") {
            comments.push(obj);
          }
          break;
        }
        case TABLES.options: {
          const name = String(obj.option_name ?? "");
          if (KEEP_OPTIONS.has(name)) {
            const raw = String(obj.option_value ?? "");
            // try unserialize for serialized options; fallback to string
            const v = raw.match(/^[aOsibd]:\d/) ? phpUnserialize(raw) : raw;
            options.push({ name, value: v });
          }
          break;
        }
      }
    }
  });

  process.stdout.write("\n");
  console.log(`✔ Stream done. Statements: ${stats.statements}, rows scanned: ${stats.rows}`);

  // Write JSON
  await Promise.all([
    fs.writeFile(path.join(OUT_DIR, "posts.json"), JSON.stringify(posts, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "postmeta.json"), JSON.stringify(postmeta, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "terms.json"), JSON.stringify(terms, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "term_taxonomy.json"), JSON.stringify(termTaxonomy, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "term_relationships.json"), JSON.stringify(termRelationships, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "users.json"), JSON.stringify(users, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "usermeta.json"), JSON.stringify(usermeta, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "comments.json"), JSON.stringify(comments, null, 0)),
    fs.writeFile(path.join(OUT_DIR, "options.json"), JSON.stringify(options, null, 2)),
    fs.writeFile(
      path.join(OUT_DIR, "elementor_page_ids.json"),
      JSON.stringify([...elementorPageIds], null, 2),
    ),
  ]);

  // URL inventory
  const inventory: Array<{ url: string; type: string; ref?: string | number }> = [];
  inventory.push({ url: "/", type: "homepage" });

  const tt = new Map(termTaxonomy.map((t) => [t.term_taxonomy_id, t]));
  const term = new Map(terms.map((t) => [t.term_id, t]));

  for (const p of posts) {
    if (p.post_status !== "publish") continue;
    const slug = p.post_name;
    if (!slug) continue;
    let url = "";
    switch (p.post_type) {
      case "post":
      case "page":
        url = `/${slug}/`;
        break;
      case "service":
        url = `/service/${slug}/`;
        break;
      case "case-study":
        url = `/case-study/${slug}/`;
        break;
      case "portfolio":
        url = `/portfolio/${slug}/`;
        break;
      case "attachment":
        // attachments are accessed via /wp-content/uploads/... — handled separately
        continue;
      default:
        continue;
    }
    inventory.push({ url, type: p.post_type, ref: p.ID });
  }

  // Categories + tags + custom taxonomies
  for (const ttRow of termTaxonomy) {
    const tRow = term.get(ttRow.term_id);
    if (!tRow) continue;
    let url = "";
    switch (ttRow.taxonomy) {
      case "category":
        url = `/category/${tRow.slug}/`;
        break;
      case "post_tag":
        url = `/tag/${tRow.slug}/`;
        break;
      case "service-category":
        url = `/service-category/${tRow.slug}/`;
        break;
      case "case-study-category":
        url = `/case-study-category/${tRow.slug}/`;
        break;
      case "portfolio-category":
        url = `/portfolio-category/${tRow.slug}/`;
        break;
      default:
        continue;
    }
    if (ttRow.count > 0) {
      inventory.push({ url, type: ttRow.taxonomy, ref: ttRow.term_id });
    }
  }

  // Authors
  for (const u of users) {
    inventory.push({
      url: `/author/${String(u.user_login ?? "")}/`,
      type: "author",
      ref: Number(u.ID),
    });
  }

  // System URLs
  inventory.push(
    { url: "/feed/", type: "feed" },
    { url: "/sitemap.xml", type: "sitemap" },
    { url: "/robots.txt", type: "robots" },
    { url: "/wp-login.php", type: "wp-login-redirect" },
    { url: "/portal/register/", type: "register-blocked" },
  );

  await fs.writeFile(
    path.join(OUT_DIR, "url-inventory.json"),
    JSON.stringify(inventory, null, 2),
  );

  // Summary
  const summary = {
    posts_total: posts.length,
    posts_by_type: countBy(posts, (p) => p.post_type),
    posts_by_status: countBy(posts, (p) => p.post_status),
    postmeta: postmeta.length,
    terms: terms.length,
    term_taxonomy: termTaxonomy.length,
    term_taxonomies: countBy(termTaxonomy, (t) => t.taxonomy),
    term_relationships: termRelationships.length,
    users: users.length,
    usermeta: usermeta.length,
    comments: comments.length,
    options: options.length,
    elementor_page_ids: elementorPageIds.size,
    url_inventory: inventory.length,
    url_by_type: countBy(inventory, (i) => i.type),
  };
  await fs.writeFile(path.join(OUT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));

  console.log("\n=== Phase 3 summary ===");
  console.log(JSON.stringify(summary, null, 2));
}

function countBy<T>(arr: T[], key: (t: T) => string): Record<string, number> {
  const m: Record<string, number> = {};
  for (const x of arr) {
    const k = key(x);
    m[k] = (m[k] ?? 0) + 1;
  }
  return m;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
