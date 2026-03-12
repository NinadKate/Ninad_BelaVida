import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "About" });

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900 z-0">
                    <Image
                        src="/beautiful-woman-6.png"
                        alt="Bela Vida Foundation"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        {t("title")}
                    </h1>
                    <div className="w-24 h-1 bg-brand-green mx-auto rounded-full" />
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-20 md:py-28 bg-white dark:bg-neutral-900">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <p className="text-xl md:text-3xl font-light text-neutral-600 dark:text-neutral-300 leading-relaxed mb-16 italic">
                        "{t("intro")}"
                    </p>
                </div>

                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                        {/* Mission Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-neutral-dark dark:text-white border-l-4 border-brand-green pl-6 py-2">
                                {t("missionTitle")}
                            </h2>
                            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed pl-6">
                                {t("missionText")}
                            </p>
                        </div>

                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/beautiful-woman-2.png"
                                alt="Mission"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Science Section */}
                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl md:order-last">
                            <Image
                                src="/light-bg-1.png"
                                alt="Science"
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 brand-gradient-bg mix-blend-multiply opacity-20" />
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-neutral-dark dark:text-white border-l-4 border-brand-green pl-6 py-2">
                                {t("scienceTitle")}
                            </h2>
                            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed pl-6">
                                {t("scienceText")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
