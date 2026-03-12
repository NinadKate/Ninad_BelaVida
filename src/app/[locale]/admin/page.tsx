import { db } from "@/lib/db";
import { orders, users, products, categories } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/routing";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import AdminProducts from "@/components/admin/AdminProducts";
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
                <div className="overflow-x-auto bg-white dark:bg-neutral-900/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-neutral-med dark:border-white/5 transition-all duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-soft dark:bg-white/5 border-b border-neutral-med dark:border-white/5">
                            <tr>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.id')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.date')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.customer')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.status')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.total')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('orders.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-med dark:divide-white/5">
                            {allOrders.map((order) => {
                                const shipping = order.shippingInfo as any;
                                return (
                                    <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-300">
                                        <td className="p-4 font-mono text-sm text-neutral-dark dark:text-neutral-300">#{order.id}</td>
                                        <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="font-bold text-neutral-dark dark:text-neutral-200">{shipping.fullName}</div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400">{shipping.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-neutral-dark dark:text-neutral-200">
                                            {formatCurrency(order.total, getCurrencyForLocale(locale), locale)}
                                        </td>
                                        <td className="p-4">
                                            <button className="text-brand-green hover:underline text-sm font-medium">{t('orders.view')}</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {allOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-500 italic">{t('orders.noOrders')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
