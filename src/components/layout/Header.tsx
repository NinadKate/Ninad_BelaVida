"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Search, ShoppingBag, User, Globe, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { COUNTRIES } from "@/constants/countries";
import { useCartStore } from "@/lib/store/cart";
import { useSearchStore } from "@/lib/store/search";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "solar", slug: "solar" },
  { key: "facial", slug: "facial" },
  { key: "corporal", slug: "corporal" },
  { key: "atopic", slug: "piel-atopica" },
  { key: "catalog", href: "/products" },
];

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const currentCountry = COUNTRIES.find((c) => c.locale === locale) || COUNTRIES[0];
  const { itemCount, setIsOpen } = useCartStore();
  const { openSearch } = useSearchStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = mounted ? itemCount() : 0;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-out",
        scrolled
          ? "py-2"
          : "py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-500 ease-out",
          scrolled
            ? "max-w-5xl rounded-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl border border-neutral-200/50 dark:border-white/10 shadow-lg"
            : "max-w-7xl bg-transparent border-transparent"
        )}>

        <div className={cn(
          "px-4 flex items-center justify-between gap-2 transition-all duration-500 ease-out",
          scrolled ? "h-14" : "h-[var(--header-height)]"
        )}>

          {/* Left: Hamburger (Mobile) + Country (Desktop) */}
          <div className="flex items-center gap-2 flex-1">
            {/* Mobile Hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 hover:bg-neutral-soft dark:hover:bg-white/10 rounded-full transition-colors">
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-white dark:bg-neutral-900 border-r dark:border-white/10">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-med dark:border-white/10">
                    <span className="text-lg font-bold font-heading uppercase tracking-tight">Menu</span>
                    <SheetClose asChild>
                      <button className="p-1 rounded-full hover:bg-neutral-soft transition-colors">
                        <X size={18} />
                      </button>
                    </SheetClose>
                  </div>
                  {/* Mobile Nav Links */}
                  <nav className="flex-1 overflow-y-auto py-4 px-2">
                    {NAV_LINKS.map((item) => {
                      const href = item.href || `/products/${item.slug}`;
                      const isActive = pathname === href || pathname.startsWith(href + "/");
                      return (
                        <SheetClose asChild key={item.key}>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center px-4 py-3 text-sm font-medium uppercase tracking-widest rounded-xl my-0.5 transition-all",
                              isActive
                                ? "bg-brand-green/10 text-brand-green font-bold"
                                : "text-neutral-dark hover:bg-neutral-soft"
                            )}
                          >
                            {t(item.key)}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                  {/* Mobile Country Selector */}
                  <div className="border-t border-neutral-med px-4 py-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold px-2">Region</p>
                    {COUNTRIES.map((country) => (
                      <SheetClose asChild key={country.code}>
                        <Link
                          href={pathname}
                          locale={country.locale as any}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                            country.locale === locale
                              ? "bg-brand-green text-white font-medium"
                              : "hover:bg-neutral-soft"
                          )}
                        >
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Country Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "hidden md:flex items-center gap-1.5 font-medium transition-colors py-1.5 px-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10",
                    scrolled ? "text-xs" : "text-sm",
                    "text-neutral-dark dark:text-white hover:text-brand-green"
                  )}
                  suppressHydrationWarning
                >
                  <Globe size={16} />
                  <span>{currentCountry.flag}</span>
                  <span>{currentCountry.code}</span>
                  <ChevronDown size={13} className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px] rounded-xl p-1.5 shadow-xl dark:bg-neutral-900 dark:border-white/10">
                {COUNTRIES.map((country) => (
                  <DropdownMenuItem key={country.code} asChild>
                    <Link
                      href={pathname}
                      locale={country.locale as any}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
                        country.locale === locale && "font-semibold text-brand-green"
                      )}
                    >
                      <span>{country.flag}</span>
                      <span className="flex-1">{country.name}</span>
                      {country.locale === locale && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Logo — always middle in flow, no absolute */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/belavida_logo.png"
              alt="Bela Vida"
              className={cn(
                "object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm",
                scrolled ? "w-6 h-6" : "w-7 h-7 md:w-18 md:h-18"
              )}
            />
            <span
              className={cn(
                "font-bold font-heading uppercase tracking-tight dark:text-white transition-all duration-500",
                scrolled ? "text-base md:text-xl" : "text-lg md:text-4xl"
              )}
            >
              Bela Vida
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5 md:gap-1 flex-1 justify-end" suppressHydrationWarning>
            {/* Search */}
            <button
              onClick={openSearch}
              className="p-2.5 hover:bg-neutral-soft dark:hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-105 group"
              aria-label="Search"
            >
              <Search size={20} className="text-neutral-dark dark:text-white group-hover:text-brand-green transition-colors" />
            </button>

            {/* Account */}
            <button
              onClick={() => session ? router.push("/account") : router.push("/login")}
              className="p-2.5 hover:bg-neutral-soft dark:hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-105 group"
              aria-label="Account"
            >
              <User size={20} className="text-neutral-dark dark:text-white group-hover:text-brand-green transition-colors" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2.5 hover:bg-neutral-soft dark:hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-105 group relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="text-neutral-dark dark:text-white group-hover:text-brand-green transition-colors" />
              {mounted && cartCount > 0 && (
                <Badge
                  className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-bold bg-brand-green hover:bg-brand-green text-white rounded-full flex items-center justify-center animate-in zoom-in duration-200"
                >
                  {cartCount}
                </Badge>
              )}
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Primary Navigation */}
        <nav
          className={cn(
            "hidden md:flex justify-center gap-1 transition-all duration-500 ease-out overflow-hidden",
            scrolled ? "h-0 opacity-0 pointer-events-none" : "container mx-auto px-4 h-10 opacity-100"
          )}
        >
          {NAV_LINKS.map((item) => {
            const href = item.href || `/products/${item.slug}`;
            const isActive = pathname === href || (href !== "/products" && pathname.startsWith(href));
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "relative px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full group",
                  isActive
                    ? "text-brand-green bg-brand-green/10"
                    : "text-neutral-dark dark:text-neutral-300 hover:text-brand-green hover:bg-neutral-100 dark:hover:bg-white/5"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
