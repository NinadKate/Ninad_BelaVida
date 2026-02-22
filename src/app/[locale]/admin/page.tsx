import { db } from "@/lib/db";
import { orders, users, products, categories } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/routing";
import { formatCurrency } from "@/lib/utils";
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
            <h1 className="text-3xl font-bold font-heading mb-6 text-neutral-dark">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-neutral-med">
                <a
                    href={`/${locale}/admin?tab=orders`}
                    className={`px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'orders' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-500 hover:text-neutral-dark'}`}
                >
                    {t('tabs.orders')}
                </a>
                <a
                    href={`/${locale}/admin?tab=products`}
                    className={`px-4 py-2 font-bold border-b-2 transition-colors ${currentTab === 'products' ? 'border-brand-red text-brand-red' : 'border-transparent text-neutral-500 hover:text-neutral-dark'}`}
                >
                    {t('tabs.products')}
                </a>
            </div>

            {currentTab === 'orders' && (
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-neutral-med">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-soft border-b border-neutral-med">
                            <tr>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.id')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.date')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.customer')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.status')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.total')}</th>
                                <th className="p-4 font-bold text-sm text-neutral-dark">{t('orders.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-med">
                            {allOrders.map((order) => {
                                const shipping = order.shippingInfo as any;
                                return (
                                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="p-4 font-mono text-sm">#{order.id}</td>
                                        <td className="p-4 text-sm text-neutral-600">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="font-bold text-neutral-dark">{shipping.fullName}</div>
                                            <div className="text-xs text-neutral-500">{shipping.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-neutral-200 text-neutral-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-neutral-dark">
                                            {formatCurrency(order.total, order.currency, locale)}
                                        </td>
                                        <td className="p-4">
                                            <button className="text-brand-red hover:underline text-sm font-medium">{t('orders.view')}</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {allOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-neutral-500 italic">{t('orders.noOrders')}</td>
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
