"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/constants/countries";

interface Category {
    id: number;
    name: Record<string, string>;
}

interface Product {
    id?: number;
    slug: string;
    sku?: string;
    price: string | number;
    prices: Record<string, string | number>;
    name: Record<string, string>;
    description: Record<string, string>;
    categoryId: number;
    stock: number;
    images: string[];
}

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Default form state
    const [formData, setFormData] = useState<Product>(product || {
        slug: "",
        sku: "",
        price: "",
        prices: {},
        name: { "es-CL": "", "en": "" },
        description: { "es-CL": "", "en": "" },
        categoryId: categories[0]?.id || 1,
        stock: 0,
        images: [""],
    });

    const isEdit = !!product?.id;

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (field: 'name' | 'description', locale: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: { ...prev[field], [locale]: value }
        }));
    };

    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get presigned URL
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });

            if (!res.ok) throw new Error("Failed to get upload URL");
            const { uploadUrl, publicUrl } = await res.json();

            // 2. Upload to R2
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });

            if (!uploadRes.ok) throw new Error("Failed to upload file");

            // 3. Update form
            setFormData(prev => ({ ...prev, images: [publicUrl] }));
        } catch (err) {
            console.error(err);
            setError("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const method = isEdit ? "PUT" : "POST";
            const body = isEdit ? { ...formData, id: product?.id } : formData;

            // Clean up empty images
            body.images = body.images.filter(img => img.trim() !== "");

            const res = await fetch("/api/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Operation failed");

            onSuccess();
        } catch (err) {
            setError("Failed to save product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "New Product"}</h2>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input
                                value={formData.slug}
                                onChange={e => handleChange("slug", e.target.value)}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">SKU</label>
                            <input
                                value={formData.sku || ""}
                                onChange={e => handleChange("sku", e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={e => handleChange("categoryId", Number(e.target.value))}
                                className="w-full border rounded p-2"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name['es-CL'] || c.name['en']}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Base Price (Global)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => handleChange("price", e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => handleChange("stock", e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-bold mb-2">Regional Pricing</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {COUNTRIES.map(country => (
                                <div key={country.code}>
                                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                                        {country.flag} {country.name} ({country.currency})
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.prices?.[country.currency] || ""}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            prices: { ...prev.prices, [country.currency]: e.target.value }
                                        }))}
                                        placeholder={formData.price.toString()}
                                        className="w-full border rounded p-2 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-bold mb-2">Localization</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name (ES)</label>
                                <input
                                    value={formData.name['es-CL']}
                                    onChange={e => handleNestedChange("name", "es-CL", e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name (EN)</label>
                                <input
                                    value={formData.name['en']}
                                    onChange={e => handleNestedChange("name", "en", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description (ES)</label>
                                <textarea
                                    value={formData.description['es-CL']}
                                    onChange={e => handleNestedChange("description", "es-CL", e.target.value)}
                                    className="w-full border rounded p-2 h-20"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Description (EN)</label>
                                <textarea
                                    value={formData.description['en']}
                                    onChange={e => handleNestedChange("description", "en", e.target.value)}
                                    className="w-full border rounded p-2 h-20"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <div className="flex gap-4 items-center">
                            {formData.images[0] && (
                                <img src={formData.images[0]} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-red/10 file:text-brand-red hover:file:bg-brand-red/20"
                                disabled={uploading}
                            />
                            {uploading && <span className="text-xs text-neutral-500">Uploading...</span>}
                        </div>
                        {/* Fallback URL input */}
                        <input
                            value={formData.images[0] || ""}
                            onChange={e => setFormData(p => ({ ...p, images: [e.target.value] }))}
                            className="w-full border rounded p-2 mt-2 text-xs text-neutral-400"
                            placeholder="Or enter image URL directly"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-brand-red text-white rounded hover:bg-brand-red-dark disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
