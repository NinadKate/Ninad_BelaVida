"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { COUNTRIES } from "@/constants/countries";

export default function Header() {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(COUNTRIES[0]);

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
                <button
                  key={country.code}
                  onClick={() => {
                    setCurrentCountry(country);
                    setIsCountryOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-soft rounded-lg transition-colors"
                >
                  <span>{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-1 group">
             <span className="bg-brand-red text-white px-2 py-0.5 rounded italic transition-transform group-hover:scale-110">B</span>
             <span className="text-neutral-dark">BELLA VIDA</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 text-neutral-dark">
          <button className="p-2 hover:bg-neutral-soft rounded-full transition-colors group">
            <Search size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />
          </button>
          <button className="p-2 hover:bg-neutral-soft rounded-full transition-colors group">
            <User size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />
          </button>
          <Link href="/cart" className="p-2 hover:bg-neutral-soft rounded-full transition-colors group relative">
            <ShoppingBag size={22} className="group-hover:text-brand-red group-hover:scale-110 transition-all" />
            <span className="absolute top-1 right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="container mx-auto px-4 mt-[-8px] flex justify-center gap-8 text-[13px] font-medium uppercase tracking-widest text-neutral-dark overflow-x-auto whitespace-nowrap scrollbar-hide">
        {["Solar", "Facial", "Corporal", "Piel Atópica", "Catálogo"].map((item) => (
          <Link
            key={item}
            href={`/shop/${item.toLowerCase().replace(" ", "-")}`}
            className="pb-2 border-b-2 border-transparent hover:border-brand-red hover:text-brand-red transition-all"
          >
            {item}
          </Link>
        ))}
      </nav>
    </header>
  );
}
