// Verify media files on disk match Media DB rows; flag any missing.
// Final URL rewrite sweep on Post.content (idempotent).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@vsi/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "apps/web/public");

async function main() {
  const allMedia = await prisma.media.findMany();
  let missing = 0;
  const missingList: string[] = [];

  for (const m of allMedia) {
    const fullPath = path.join(PUBLIC, m.path);
    try {
      await fs.access(fullPath);
    } catch {
      missing++;
      missingList.push(m.path);
    }
  }

  console.log(`Media DB rows: ${allMedia.length}`);
  console.log(`Files on disk verified: ${allMedia.length - missing}`);
  console.log(`Missing on disk: ${missing}`);
  if (missing > 0 && missing < 30) {
    console.log("Missing files:");
    for (const f of missingList) console.log(`  ${f}`);
  }

  // Sweep posts for any remaining vsolutionsinc URLs
  const stale = await prisma.post.findMany({
    where: {
      OR: [
        { content: { contains: "vsolutionsinc.com/wp-content" } },
        { content: { contains: "://vsolutionsinc.com" } },
        { content: { contains: "://www.vsolutionsinc.com" } },
      ],
    },
    select: { id: true, content: true, permalink: true },
  });

  if (stale.length === 0) {
    console.log("✔ All Post.content URLs already rewritten");
  } else {
    console.log(`Rewriting ${stale.length} posts with stale URLs...`);
    for (const p of stale) {
      const newContent = p.content
        .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/wp-content\/uploads\//g, "/uploads/")
        .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\/uploads\//g, "/uploads/")
        .replace(/https?:\/\/(?:www\.)?vsolutionsinc\.com\//g, "/");
      if (newContent !== p.content) {
        await prisma.post.update({
          where: { id: p.id },
          data: { content: newContent },
        });
      }
    }
    console.log("✔ URL rewrite complete");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
