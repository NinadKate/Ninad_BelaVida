import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import { useTranslations } from 'next-intl';
import { getFeaturedProducts, getProductsByCategory, getAllCategories } from "@/lib/db/queries";
import { getLocalized, formatCurrency } from "@/lib/utils";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await useTranslations('Hero');
  const featuredProducts = await getFeaturedProducts(4);
  const categories = await getAllCategories();

  // Simple hardcoded mapping for category lines, or just use categories from DB
  const recommendedLines = categories.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center bg-neutral-soft overflow-hidden">
        <div className="container mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="text-brand-red font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-4 block">
              {t('tagline')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-dark mb-6 leading-tight">
              {t.rich('title', {
                br: () => <br />,
                italic: (chunks) => <span className="italic font-light">{chunks}</span>
              })}
            </h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-md leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop/solar"
                className="btn-premium bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/20 text-center"
              >
                {t('discover')}
              </Link>
              <Link
                href="/shop/facial"
                className="btn-premium border border-neutral-dark text-neutral-dark hover:bg-neutral-dark hover:text-white text-center"
              >
                {t('routines')}
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative h-[600px] animate-in fade-in zoom-in duration-1000">
            <Image
              src="/hero-skincare.png" // This should ideally be a dynamic hero image
              alt="BELLA VIDA Premium Skincare"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/40 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* Featured Lines Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-dark mb-2">Nuestras Líneas</h2>
            <p className="text-neutral-500">Encuentra el cuidado perfecto para tus necesidades.</p>
          </div>
          <Link href="/shop" className="text-neutral-dark font-medium underline underline-offset-4 hover:text-brand-red transition-colors">
            Ver todo el catálogo
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedLines.map((cat) => (
            <Link key={cat.id} href={`/products/${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-soft">
              <div className="absolute inset-0 bg-neutral-dark/0 group-hover:bg-neutral-dark/10 transition-colors z-10" />
              {/* If category has image use it, else placeholder color or pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">{getLocalized(cat.name, locale)}</h3>
                <span className="text-sm text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity">Explorar &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-24 bg-white border-t border-neutral-med">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-dark mb-4 tracking-tight">Recomendados para ti</h2>
            <div className="w-20 h-1 bg-brand-red mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${(product as any).category.slug}/${product.slug}`}>
                {/* Reuse ProductCard but need to map properties correctly */}
                <ProductCard
                  name={getLocalized(product.name, locale)}
                  category={getLocalized((product as any).category.name, locale)}
                  price={formatCurrency(product.price, "CLP", locale)}
                  imageUrl={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
