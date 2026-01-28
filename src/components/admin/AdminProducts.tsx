"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
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
        if (!confirm("Are you sure you want to delete this product?")) return;

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
                <h2 className="text-xl font-bold font-heading text-neutral-dark">Products</h2>
                <button
                    onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                    className="bg-brand-red text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-red-dark transition-colors"
                >
                    + Add Product
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-neutral-med">
                <table className="w-full text-left">
                    <thead className="bg-neutral-soft border-b border-neutral-med">
                        <tr>
                            <th className="p-4 text-sm">ID</th>
                            <th className="p-4 text-sm">Name</th>
                            <th className="p-4 text-sm">Category</th>
                            <th className="p-4 text-sm">Price</th>
                            <th className="p-4 text-sm">Stock</th>
                            <th className="p-4 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-med">
                        {products.map((product) => {
                            const cat = categories.find(c => c.id === product.categoryId);
                            return (
                                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="p-4 text-sm text-neutral-500">#{product.id}</td>
                                    <td className="p-4 text-sm font-bold text-neutral-dark">
                                        {product.name[locale] || product.name['es-CL']}
                                    </td>
                                    <td className="p-4 text-sm text-neutral-600">
                                        {cat?.name[locale] || cat?.name['es-CL'] || '-'}
                                    </td>
                                    <td className="p-4 text-sm font-bold">
                                        {formatCurrency(product.price, "CLP", locale)}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {product.stock}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                                            className="text-neutral-500 hover:text-blue-600 p-1"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-neutral-500 hover:text-red-600 p-1"
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
