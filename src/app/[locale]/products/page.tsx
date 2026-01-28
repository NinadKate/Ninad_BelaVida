import { getTranslations } from 'next-intl/server';
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProductCard from "@/components/ui/ProductCard";
import { Link } from "@/i18n/routing";
import { getLocalized, formatCurrency } from "@/lib/utils";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Navigation' });

    const allProducts = await db.query.products.findMany({
        where: eq(products.active, true),
        with: {
            category: true
        }
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-neutral-dark">Catálogo Completto</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {allProducts.map((product) => (
                    <Link key={product.id} href={`/products/${(product as any).category.slug}/${product.slug}`}>
                        <ProductCard
                            name={getLocalized(product.name, locale)}
                            category={getLocalized((product as any).category.name, locale)}
                            price={formatCurrency(product.price, "CLP", locale)}
                            imageUrl={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                        />
                    </Link>
                ))}
            </div>

            {allProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-neutral-500">No hay productos disponibles en este momento.</p>
                </div>
            )}
        </div>
    );
}
