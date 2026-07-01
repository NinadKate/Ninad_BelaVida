import { db } from ".";
import { categories, products } from "./schema";
import { eq, desc } from "drizzle-orm";

export type LocalizedString = Record<string, string>;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
    }) as Category | undefined;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];

    return await db.query.products.findMany({
        where: eq(products.categoryId, category.id),
        orderBy: (products, { desc }) => [desc(products.created_at)],
    }) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return await db.query.products.findFirst({
        where: eq(products.slug, slug),
    }) as Product | undefined;
}

export async function getAllCategories(): Promise<Category[]> {
    return await db.query.categories.findMany({
        where: eq(categories.active, true),
    }) as Category[];
}

export async function getFeaturedProducts(limit = 4) {
    const featuredProducts = await db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.active, true))
      .orderBy(desc(products.created_at))
      .limit(limit);

    return featuredProducts.map(({ product, category }) => ({
      ...product,
      category,
    }));
}
