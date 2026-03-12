"use client";

import { useState } from "react";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import ProductForm from "./ProductForm";
import { useRouter } from "@/i18n/routing";
import { Trash2, Edit } from "lucide-react";

interface AdminProductsProps {
    initialProducts: any[];
    categories: any[];
    locale: string;
}

export default function AdminProducts({ initialProducts, categories, locale }: AdminProductsProps) {
    const router = useRouter();
    const t = useTranslations('Admin.products');
    const [products, setProducts] = useState(initialProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const refreshData = () => {
        router.refresh(); // Refresh server data
        // For immediate UI update, we could re-fetch or rely on router.refresh() 
        // but router.refresh may not update state derived from props immediately if component doesn't re-render with new props.
        // So simpler to just reload or wait. 
        // Actually simply reloading the page using router.refresh() is standard in Next App Router 
        // but client state might need manual update or key reset.
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('confirmDelete'))) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (e) {
            alert("Error deleting");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-heading text-neutral-dark dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-neutral-400">{t('title')}</h2>
                <button
                    onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                    className="bg-black dark:brand-gradient-bg text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 dark:hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    + {t('add')}
                </button>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-neutral-900/50 dark:backdrop-blur-xl rounded-xl shadow-lg border border-neutral-med dark:border-white/5 transition-all duration-500">
                <table className="w-full text-left">
                    <thead className="bg-neutral-soft dark:bg-white/5 border-b border-neutral-med dark:border-white/5 text-neutral-dark dark:text-neutral-200">
                        <tr>
                            <th className="p-4 text-sm font-bold">{t('id')}</th>
                            <th className="p-4 text-sm font-bold">{t('name')}</th>
                            <th className="p-4 text-sm font-bold">{t('category')}</th>
                            <th className="p-4 text-sm font-bold">{t('price')}</th>
                            <th className="p-4 text-sm font-bold">{t('stock')}</th>
                            <th className="p-4 text-sm font-bold text-right">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-med dark:divide-white/5">
                        {products.map((product) => {
                            const cat = categories.find(c => c.id === product.categoryId);
                            return (
                                <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-300">
                                    <td className="p-4 text-sm text-neutral-500 dark:text-neutral-400">#{product.id}</td>
                                    <td className="p-4 text-sm font-bold text-neutral-dark dark:text-neutral-200">
                                        {product.name[locale] || product.name['es-CL']}
                                    </td>
                                    <td className="p-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        {cat?.name[locale] || cat?.name['es-CL'] || '-'}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-neutral-dark dark:text-neutral-200" suppressHydrationWarning>
                                        {formatCurrency(product.price, getCurrencyForLocale(locale), locale)}
                                    </td>
                                    <td className="p-4 text-sm text-neutral-dark dark:text-neutral-300">
                                        {product.stock}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                                            className="text-neutral-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 p-1 transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 p-1 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => { setIsFormOpen(false); refreshData(); }}
                />
            )}
        </div>
    );
}
