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
                <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-neutral-med dark:border-neutral-700">

                    {/* Left Column - Contact Info */}
                    <div className="bg-neutral-dark text-white p-12 md:w-2/5 flex flex-col justify-center relative overflow-hidden">
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
                                    <h4 className="font-bold mb-1 text-white/90">{t("address")}</h4>
                                    <p className="text-white/60 leading-relaxed">{t("addressValue")}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1 text-white/90">{t("phone")}</h4>
                                    <p className="text-white/60 leading-relaxed">{t("phoneValue")}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-white/10 rounded-full text-brand-green shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1 text-white/90">{t("email")}</h4>
                                    <p className="text-white/60 leading-relaxed">{t("emailValue")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="p-12 md:w-3/5">
                        <h3 className="text-2xl font-bold text-neutral-dark dark:text-white mb-8">
                            {t("formTitle")}
                        </h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{t("nameLabel")}</label>
                                    <input
                                        type="text"
                                        placeholder={t("namePlaceholder")}
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-shadow"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{t("emailLabel")}</label>
                                    <input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-shadow"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{t("subjectLabel")}</label>
                                <input
                                    type="text"
                                    placeholder={t("subjectPlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-shadow"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{t("messageLabel")}</label>
                                <textarea
                                    rows={5}
                                    placeholder={t("messagePlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-shadow resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="w-full btn-premium brand-gradient-bg text-white hover:opacity-90 mt-4 shadow-lg shadow-brand-green/20"
                            >
                                {t("submit")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
