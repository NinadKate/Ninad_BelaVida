import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Contact" });

    return (
      <div className="min-h-screen bg-neutral-soft dark:bg-neutral-dark pb-24">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-med dark:border-neutral-800 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-dark dark:text-white mb-6">
              {t("title")}
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="max-w-3xl mx-auto rounded-3xl shadow-xl overflow-hidden border border-neutral-med dark:border-neutral-700">
            {/* Left Column - Contact Info */}
            <div className="bg-neutral-dark text-white p-12 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              <div className="space-y-12 relative z-10">
                <div>
                  <h3 className="text-xl font-bold mb-8 italic">Bela Vida</h3>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-white/90">
                      {t("address")}
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      {t("addressValue")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-white/90">
                      {t("phone")}
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      +56 9 9051 5384
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-white/90">
                      {t("email")}
                    </h4>
                    <p className="text-white/60 leading-relaxed">
                      belavidachile@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
