import { Link } from "@/i18n/routing";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import { getTranslations } from 'next-intl/server';
import { getFeaturedProducts, getAllCategories } from "@/lib/db/queries";
import { getLocalized, formatCurrency, getRegionalPrice } from "@/lib/utils";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  const tHome = await getTranslations({ locale, namespace: 'Home' });
  const featuredProducts = await getFeaturedProducts(4);
  const categories = await getAllCategories();

  const recommendedLines = categories.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section: fills remaining viewport height after navbar */}
      <section className="relative min-h-[calc(90vh-var(--header-height))] w-full flex items-center overflow-hidden">
        <div className="container mx-auto px-6 py-8 md:py-16 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700 text-center md:text-left">
            <span className="text-brand-green font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-3 md:mb-4 block">
              {t('tagline')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-neutral-dark dark:text-white mb-4 md:mb-6 leading-tight">
              {t.rich('title', {
                br: () => <br />,
                italic: (chunks) => <span className="italic font-light">{chunks}</span>
              })}
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 mb-6 md:mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Link
                href="/products/solar"
                className="btn-premium brand-gradient-bg text-white hover:opacity-90 shadow-lg shadow-blue-500/20 text-center"
              >
                {t('discover')}
              </Link>
              <Link
                href="/products/facial"
                className="btn-premium border border-neutral-dark dark:border-white text-neutral-dark dark:text-white hover:bg-neutral-dark dark:hover:bg-white hover:text-white dark:hover:text-neutral-dark text-center transition-colors"
              >
                {t('routines')}
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative h-[600px] animate-in fade-in zoom-in duration-1000 p-8">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white/40 dark:border-white/10 group">
              <Image
                src="/beautiful-woman-4.png"
                alt="BELA VIDA Premium Lifestyle"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/40 dark:bg-white/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* Featured Lines Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-dark dark:text-white mb-2">{tHome('linesTitle')}</h2>
            <p className="text-neutral-500 dark:text-neutral-400">{tHome('linesSubtitle')}</p>
          </div>
          <Link href="/products" className="text-neutral-dark dark:text-neutral-300 font-medium underline underline-offset-4 hover:text-brand-green transition-colors">
            {tHome('viewCatalog')}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendedLines.map((cat) => (
            <Link key={cat.id} href={`/products/${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-soft dark:bg-neutral-800">
              <div className="absolute inset-0 bg-neutral-dark/0 group-hover:bg-neutral-dark/10 transition-colors z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-green transition-colors">{getLocalized(cat.name, locale)}</h3>
                <span className="text-sm text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity">{tHome('explore')} &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Essence Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-dark dark:text-white mb-4 tracking-tight">{tHome('essenceTitle')}</h2>
          <div className="w-20 h-1 bg-brand-green mx-auto rounded-full mb-6" />
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {tHome('essenceSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
          {/* Main Large Image */}
          <div className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden group shadow-lg min-h-[400px]">
            <Image src="/beautiful-woman-2.png" alt="Lifestyle 1" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <h3 className="text-3xl font-bold text-white mb-2">{tHome('scienceTitle')}</h3>
              <p className="text-white/80">{tHome('scienceSubtitle')}</p>
            </div>
          </div>

          {/* Top Right 1 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg min-h-[250px] md:min-h-0">
            <Image src="/beautiful-woman-3.png" alt="Lifestyle 2" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>

          {/* Top Right 2 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg min-h-[250px] md:min-h-0">
            <Image src="/beautiful-woman-4.png" alt="Lifestyle 3" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>

          {/* Bottom Right 1 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg min-h-[250px] md:min-h-0">
            <Image src="/beautiful-woman-5.png" alt="Lifestyle 4" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>

          {/* Bottom Right 2 */}
          <div className="relative rounded-3xl overflow-hidden group shadow-lg min-h-[250px] md:min-h-0">
            <Image src="/beautiful-woman-6.png" alt="Lifestyle 5" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-24 bg-white dark:bg-neutral-900 border-t border-neutral-med dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-dark dark:text-white mb-4 tracking-tight">{tHome('recommendedTitle')}</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const regionalPrice = getRegionalPrice(product, locale);
              return (
                <Link key={product.id} href={`/products/${(product as any).category.slug}/${product.slug}`}>
                  <ProductCard
                    name={getLocalized(product.name, locale)}
                    category={getLocalized((product as any).category.name, locale)}
                    price={formatCurrency(regionalPrice.amount, regionalPrice.currency, locale)}
                    imageUrl={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
