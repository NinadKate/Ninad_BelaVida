import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Contact" });

    const locations = [
      {
        country: "Chile",
        address: ["Modulo 9,", "Mall Zofri, Iquique, Chile"],
        phone: "+56 990515384",
        email: "belavidachile@gmail.com",
      },
      {
        country: "Argentina",
        address: ["Av. Gral Las Heras 2464, C1425ASO, C.A.B.A."],
        phone: "+54 911-5507-1150",
        email: "info@vidabella.org",
      },
      {
        country: "Bolivia",
        address: ["Av. América Nro. 960, Cochabamba"],
        phone: "+591 72285512",
        email: "info@vidabella.org",
      },
    ];

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
          <div className="max-w-5xl mx-auto rounded-3xl shadow-xl overflow-hidden border border-neutral-med dark:border-neutral-700 bg-neutral-dark text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="p-8 md:p-12 relative z-10">
              <div className="max-w-2xl mb-10">
                <h3 className="text-xl font-bold mb-4 italic">Bela Vida</h3>
                <p className="text-white/60 leading-relaxed">
                  {t("description")}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {locations.map((location) => (
                  <div
                    key={location.country}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                  >
                    <h4 className="text-2xl font-bold mb-6 text-white">
                      {location.country}
                    </h4>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1 text-white/90">
                            {t("address")}
                          </h5>
                          <p className="text-white/60 leading-relaxed">
                            {location.address.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1 text-white/90">
                            {t("phone")}
                          </h5>
                          <p className="text-white/60 leading-relaxed">
                            {location.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1 text-white/90">
                            {t("email")}
                          </h5>
                          <p className="text-white/60 leading-relaxed break-all">
                            {location.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
