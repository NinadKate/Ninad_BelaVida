"use client";

import { useState } from "react";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import AdminOrderModal from "./AdminOrderModal";

interface AdminOrdersProps {
    initialOrders: any[];
    locale: string;
}

export default function AdminOrders({ initialOrders, locale }: AdminOrdersProps) {
    const t = useTranslations('Admin.orders');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    const refreshData = () => {
        window.location.reload();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'received':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'in progress':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'on delivery':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
        }
    };

    return (
        <div>
            <div className="overflow-x-auto bg-white dark:bg-neutral-900/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-neutral-med dark:border-white/5 transition-all duration-500">
                <table className="w-full text-left">
                    <thead className="bg-neutral-soft dark:bg-white/5 border-b border-neutral-med dark:border-white/5">
                        <tr>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('id')}</th>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('date')}</th>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('customer')}</th>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('status')}</th>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('total')}</th>
                            <th className="p-4 font-bold text-sm text-neutral-dark dark:text-neutral-200">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-med dark:divide-white/5">
                        {initialOrders.map((order) => {
                            const shipping = order.shippingInfo as any;
                            return (
                                <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="p-4 font-mono text-sm text-neutral-dark dark:text-neutral-300">#{order.id}</td>
                                    <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400" suppressHydrationWarning>
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="font-bold text-neutral-dark dark:text-neutral-200">{shipping.fullName}</div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">{shipping.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase transition-colors ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-neutral-dark dark:text-neutral-200">
                                        {formatCurrency(order.total, getCurrencyForLocale(locale), locale)}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-brand-green hover:underline text-sm font-medium transition-colors"
                                        >
                                            {t('view')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {initialOrders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-500 italic">{t('noOrders')}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedOrder && (
                <AdminOrderModal 
                    order={selectedOrder} 
                    locale={locale} 
                    onClose={() => setSelectedOrder(null)}
                    onSuccess={() => {
                        setSelectedOrder(null);
                        refreshData();
                    }}
                />
            )}
        </div>
    );
}
