import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import seedData from "./seed-data.json";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding database...");

  // Seed Categories
  console.log("Seeding categories...");
  for (const cat of seedData.categories) {
    await db.insert(schema.categories).values({
      slug: cat.slug,
      name: cat.name,
    }).onConflictDoNothing();
  }

  // Get categories for lookup
  const cats = await db.query.categories.findMany();
  const catMap = new Map(cats.map(c => [c.slug, c.id]));

  // Seed Products
  console.log("Seeding products...");
  for (const prod of seedData.products) {
    const categoryId = catMap.get(prod.categorySlug);
    if (!categoryId) continue;

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
}

main().catch((err) => {
  console.error("Seeding failed!");
  console.error(err);
  process.exit(1);
});
