import { db } from ".";
import { categories, products } from "./schema";
import { eq } from "drizzle-orm";

export type LocalizedString = Record<string, string>;

export async function getCategoryBySlug(slug: string) {
    return await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
    });
}

export async function getProductsByCategory(categorySlug: string) {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];

    return await db.query.products.findMany({
        where: eq(products.categoryId, category.id),
        orderBy: (products, { desc }) => [desc(products.created_at)],
    });
}

export async function getProductBySlug(slug: string) {
    return await db.query.products.findFirst({
        where: eq(products.slug, slug),
    });
}

export async function getAllCategories() {
    return await db.query.categories.findMany({
        where: eq(categories.active, true),
    });
}
