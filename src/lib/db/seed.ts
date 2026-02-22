import "dotenv/config";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import seedData from "./seed-data.json";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("Seeding database...");

  // Seed Categories
  console.log("Seeding categories...");
  for (const cat of seedData.categories) {
    await db.insert(schema.categories).values({
      slug: cat.slug,
      name: cat.name,
      active: true,
    }).onConflictDoNothing();
  }

  // Get categories for lookup
  const cats = await db.query.categories.findMany();
  const catMap = new Map(cats.map(c => [c.slug, c.id]));

  // Seed Products
  console.log("Seeding products...");
  for (const prod of seedData.products) {
    const categoryId = catMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category not found for product: ${prod.slug} (cat: ${prod.categorySlug})`);
      continue;
    }

    await db.insert(schema.products).values({
      categoryId,
      slug: prod.slug,
      price: prod.price.toString(),
      name: prod.name,
      description: prod.description,
      stock: 100,
      active: true,
    }).onConflictDoNothing();
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed!");
  console.error(err);
  process.exit(1);
});
