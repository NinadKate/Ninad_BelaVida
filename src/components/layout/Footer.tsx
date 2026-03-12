"use client";

import { Link } from "@/i18n/routing";
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navbar");

  return (
    <footer className="bg-neutral-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold tracking-tighter mb-6 italic">Bela Vida</h3>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              {t("brandDesc")}
            </p>
            <div className="flex gap-2">
              <input
                suppressHydrationWarning
                type="email"
                placeholder={t("emailPlaceholder")}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-brand-green transition-colors"
              />
              <button className="bg-white text-neutral-dark p-2 rounded-lg hover:bg-brand-green hover:text-white transition-all group" suppressHydrationWarning>
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">{t("products")}</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/products/solar" className="hover:text-white transition-colors">{tNav("solar")}</Link></li>
              <li><Link href="/products/facial" className="hover:text-white transition-colors">{tNav("facial")}</Link></li>
              <li><Link href="/products/corporal" className="hover:text-white transition-colors">{tNav("corporal")}</Link></li>
              <li><Link href="/products/piel-atopica" className="hover:text-white transition-colors">{tNav("atopic")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">{t("company")}</h4>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t("aboutUs")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">{t("followUs")}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all group">
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all group">
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all group">
                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all group">
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
            <p className="mt-8 text-xs text-neutral-500">
              {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
