/**
 * Migration: repair the Tag collection's unique indexes.
 *
 * Two indexes were wrong:
 *
 *   name_1_category_1_isSystem_1  unique, partial on { isSystem: true }
 *     Made (name, category) unique across ALL admins for system tags. Since
 *     system tags are seeded per admin, the first admin to seed blocked every
 *     admin after them with E11000 - which surfaced as a broken automations
 *     page for every subsequent demo account.
 *
 *   name_1_category_1_admin_1     unique, partial on { admin: { $ne: null } }
 *     MongoDB does not accept $ne in a partialFilterExpression, so this index
 *     never built at all.
 *
 * Both are replaced by a single index on (name, category, admin, agent).
 *
 * Run with:  node scripts/fix-tag-indexes.mjs
 */

import mongoose from "mongoose";
import { readFileSync } from "node:fs";

const STALE = ["name_1_category_1_isSystem_1", "name_1_category_1_admin_1"];
const WANTED = { name: 1, category: 1, admin: 1, agent: 1 };

function loadUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  // Fall back to .env.local so this can be run without extra setup.
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const match = env.match(/^MONGODB_URI\s*=\s*['"]?([^'"\r\n]+)/m);
    if (match) return match[1];
  } catch {
    // fall through
  }

  throw new Error("MONGODB_URI not set and not found in .env.local");
}

async function main() {
  const uri = loadUri();
  await mongoose.connect(uri);
  console.log(`Connected to ${uri.replace(/\/\/[^@]+@/, "//***@")}`);

  const tags = mongoose.connection.db.collection("tags");
  const existing = await tags.indexes();

  console.log("\nCurrent indexes:");
  existing.forEach((index) => console.log(`  ${index.name}`));

  // Drop the broken ones
  for (const name of STALE) {
    if (existing.some((index) => index.name === name)) {
      await tags.dropIndex(name);
      console.log(`\nDropped ${name}`);
    }
  }

  // Surface any data that would block the new constraint before creating it
  const duplicates = await tags
    .aggregate([
      {
        $group: {
          _id: {
            name: "$name",
            category: "$category",
            admin: "$admin",
            agent: "$agent",
          },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  if (duplicates.length > 0) {
    console.error(
      `\n${duplicates.length} duplicate tag(s) block the new index. Resolve these first:`,
    );
    duplicates.forEach((d) =>
      console.error(`  ${JSON.stringify(d._id)} x${d.count}`),
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  await tags.createIndex(WANTED, { unique: true });
  console.log("\nCreated name_1_category_1_admin_1_agent_1 (unique)");

  console.log("\nFinal indexes:");
  (await tags.indexes()).forEach((index) => console.log(`  ${index.name}`));

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
