import { getCategoryBySlug, getProductsByCategory } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { getLocalized, formatCurrency, getRegionalPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "@/i18n/routing";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ locale: string; category: string }>;
}) {
    const { locale, category: categorySlug } = await params;

    const category = await getCategoryBySlug(categorySlug);

    if (!category) {
        notFound();
    }

    const products = await getProductsByCategory(categorySlug);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading text-neutral-dark mb-2">
                    {getLocalized(category.name, locale)}
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const regionalPrice = getRegionalPrice(product, locale);
                    return (
                        <Link
                            key={product.id}
                            href={`/products/${categorySlug}/${product.slug}`}
                            className="block"
                        >
                            <ProductCard
                                name={getLocalized(product.name, locale)}
                                category={getLocalized(category.name, locale)}
                                price={formatCurrency(regionalPrice.amount, regionalPrice.currency, locale)}
                                imageUrl={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                            />
                        </Link>
                    );
                })}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
