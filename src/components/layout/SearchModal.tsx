"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchStore } from "@/lib/store/search";
import { X, Search as SearchIcon, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatCurrency, getLocalized, getCurrencyForLocale } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function SearchModal() {
    const { isOpen, closeSearch } = useSearchStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const locale = useLocale();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setResults([]);
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeSearch();
        }
      };

      if (isOpen) {
        window.addEventListener("keydown", onKeyDown);
      }

      return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, closeSearch]);

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-4 sm:pt-24 px-3"
        onPointerDown={closeSearch}
      >
        <div
          className="w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[88vh] sm:max-h-[82vh] flex flex-col"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Header / Input */}
          <div className="relative border-b border-neutral-100 p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <SearchIcon className="text-neutral-400 shrink-0" size={20} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              className="flex-1 min-w-0 text-base sm:text-xl font-medium outline-none placeholder:text-neutral-300 text-black" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading && (
              <Loader2 className="animate-spin text-brand-green" size={20} />
            )}
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.category.slug}/${product.slug}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 hover:bg-neutral-50 rounded-xl transition-colors group"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 rounded-lg overflow-hidden relative shrink-0">
                      <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={getLocalized(product.name, locale)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-neutral-dark group-hover:text-brand-green transition-colors">
                        {getLocalized(product.name, locale)}
                      </h4>
                      <p className="text-sm text-neutral-400 line-clamp-1">
                        {getLocalized(product.description, locale)}
                      </p>
                    </div>
                    <div className="font-bold text-sm sm:text-base text-neutral-dark font-heading shrink-0">
                      {formatCurrency(
                        product.price,
                        getCurrencyForLocale(locale),
                        locale,
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 && !loading ? (
              <div className="text-center py-10 text-neutral-400">
                No products found matching "{query}"
              </div>
            ) : (
              <div className="py-10 text-center text-neutral-300">
                Start typing to search...
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 p-3 text-xs text-center text-neutral-400 border-t border-neutral-100">
            Use{" "}
            <span className="font-bold border border-neutral-300 rounded px-1 mx-1">
              ESC
            </span>{" "}
            to close
          </div>
        </div>
      </div>
    );
}
