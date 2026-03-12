import { getProductBySlug } from "@/lib/db/queries";
import { notFound } from "next/navigation";
import { getLocalized, formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ locale: string; category: string; slug: string }>;
}) {
    const { locale, category: categorySlug, slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const images = product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg'];

    return (
        <div className="container mx-auto px-4 py-8 pt-12 md:pt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-med" style={{ backgroundImage: 'var(--product-bg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        <Image
                            src={images[0]}
                            alt={getLocalized(product.name, locale)}
                            fill
                            unoptimized
                            className="object-contain p-8"
                            priority
                        />
                    </div>
                    {/* Thumbnails if multiple images (Simple impl) */}
                    {images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 bg-white rounded-lg border border-neutral-med overflow-hidden flex-shrink-0 cursor-pointer hover:border-brand-green transition-colors">
                                    <Image src={img} alt="" fill unoptimized className="object-contain p-1" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-neutral-500 uppercase tracking-wide font-bold mb-2">
                            {categorySlug}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark font-heading">
                            {getLocalized(product.name, locale)}
                        </h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-2xl md:text-3xl font-bold text-neutral-dark">
                            {formatCurrency(product.price, getCurrencyForLocale(locale), locale)}
                        </span>
                        <span className="text-sm text-neutral-500 font-medium">
                            IVA Incluido
                        </span>
                    </div>

                    <div className="prose prose-neutral max-w-none text-neutral-600">
                        <p>{getLocalized(product.description, locale)}</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-neutral-med">
                        <AddToCartButton
                            product={{
                                id: product.id,
                                slug: product.slug,
                                name: getLocalized(product.name, locale),
                                price: Number(product.price),
                                image: images[0]
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
