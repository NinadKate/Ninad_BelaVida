import { db } from "@/lib/db";
import { orders, users, products, categories } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/routing";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboard({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
    const { locale } = await params;
    const { tab } = await searchParams;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect({ href: '/', locale });
        return null;
    }

    const user = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
    if (!user || user.role !== 'admin') {
        redirect({ href: '/', locale });
        return null;
    }

    const t = await getTranslations('Admin');
    const currentTab = tab || 'orders';

    // Fetch data based on tab? Or just fetch all necessary for simple dashboard.
    // Fetch generic data.
    const allOrders = currentTab === 'orders' ? await db.select().from(orders).orderBy(desc(orders.created_at)) : [];
    const allProducts = currentTab === 'products' ? await db.query.products.findMany({ orderBy: [desc(products.created_at)] }) : [];
    const allCategories = await db.query.categories.findMany();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-heading mb-6 text-neutral-dark dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-neutral-400">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-neutral-med dark:border-neutral-700">
                <a
                    href={`/${locale}/admin?tab=orders`}
                    className={`px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'orders' ? 'border-brand-green text-brand-green dark:text-brand-green' : 'border-transparent text-neutral-500 hover:text-neutral-dark dark:text-neutral-400 dark:hover:text-white'}`}
                >
                    {t('tabs.orders')}
                </a>
                <a
                    href={`/${locale}/admin?tab=products`}
                    className={`px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'products' ? 'border-brand-green text-brand-green dark:text-brand-green' : 'border-transparent text-neutral-500 hover:text-neutral-dark dark:text-neutral-400 dark:hover:text-white'}`}
                >
                    {t('tabs.products')}
                </a>
            </div>

            {currentTab === 'orders' && (
                <AdminOrders 
                    initialOrders={allOrders} 
                    locale={locale} 
                />
            )}

            {currentTab === 'products' && (
                <AdminProducts
                    initialProducts={allProducts}
                    categories={allCategories as any[]}
                    locale={locale}
                />
            )}
        </div>
    );
}
