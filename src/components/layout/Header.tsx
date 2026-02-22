"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Search, ShoppingBag, User, Globe, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { COUNTRIES } from "@/constants/countries";
import { useCartStore } from "@/lib/store/cart";
import { useSearchStore } from "@/lib/store/search";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from 'next-intl';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Navbar');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const currentCountry = COUNTRIES.find(c => c.locale === locale) || COUNTRIES[0];
  const { itemCount, setIsOpen } = useCartStore();
  const { openSearch } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass h-[var(--header-height)]">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Left: Country Selector */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsCountryOpen(!isCountryOpen)}
            className="flex items-center gap-2 text-sm font-medium hover:text-brand-red transition-colors"
          >
            <Globe size={18} />
            <span>{currentCountry.code}</span>
            <ChevronDown size={14} className={`transition-transform ${isCountryOpen ? "rotate-180" : ""}`} />
          </button>

          {isCountryOpen && (
            <div className="absolute top-full mt-2 left-0 bg-white shadow-xl rounded-xl border border-neutral-med p-2 min-w-[160px] animate-in fade-in slide-in-from-top-2">
              {COUNTRIES.map((country) => (
                <Link
                  key={country.code}
                  href={pathname}
                  locale={country.locale as any}
                  onClick={() => {
                    setIsCountryOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-soft rounded-lg transition-colors"
                >
                  <span>{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-1 group">
            <span className="bg-brand-red text-white px-2 py-0.5 rounded italic transition-transform group-hover:scale-110">B</span>
            <span className="text-neutral-dark uppercase tracking-tight">Bela Vida</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 text-neutral-dark" suppressHydrationWarning>
          <button
            onClick={openSearch}
            className="p-2 hover:bg-neutral-soft rounded-full transition-colors group"
          >
            <Search size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />
          </button>
          <button
            onClick={() => session ? router.push('/account') : router.push('/login')}
            className="p-2 hover:bg-neutral-soft rounded-full transition-colors group"
          >
            <User size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-neutral-soft rounded-full transition-colors group relative"
          >
            <ShoppingBag size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />

            {mounted && itemCount() > 0 && (
              <span className="absolute top-1 right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount()}
              </span>
            )}

          </button>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="container mx-auto px-4 mt-[-8px] flex justify-center gap-8 text-[13px] font-medium uppercase tracking-widest text-neutral-dark overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { key: "solar", label: t('solar') },
          { key: "facial", label: t('facial') },
          { key: "corporal", label: t('corporal') },
          { key: "atopic", label: t('atopic'), slug: "piel-atopica" },
          { key: "catalog", label: t('catalog'), href: "/products" }
        ].map((item) => (
          <Link
            key={item.key}
            href={item.href || `/products/${item.slug || item.key}`}
            className="pb-2 border-b-2 border-transparent hover:border-brand-red hover:text-brand-red transition-all"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
