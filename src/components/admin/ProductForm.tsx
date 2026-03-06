"use client";

import { useState, useEffect } from "react";
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

    // Fetch next SKU for new products
    useEffect(() => {
        if (!isEdit) {
            fetch('/api/products/next-sku')
                .then(res => res.json())
                .then(data => {
                    if (data.nextSku) {
                        setFormData(prev => ({ ...prev, sku: data.nextSku }));
                    }
                })
                .catch(err => console.error("Failed to fetch next SKU:", err));
        }
    }, [isEdit]);

    // Auto-generate URL-friendly slug from any string
    const slugify = (str: string) =>
        str.toLowerCase().trim()
            .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (field: 'name' | 'description', locale: string, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: { ...prev[field], [locale]: value } };
            // Auto-generate slug from Spanish name when creating a new product
            if (!isEdit && field === 'name' && locale === 'es-CL') {
                updated.slug = slugify(value);
            }
            return updated;
        });
    };

    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>(product?.images?.[0] || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

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

            // 3. Update form with R2 public URL (used when saving the product)
            setFormData(prev => ({ ...prev, images: [publicUrl] }));
        } catch (err) {
            console.error(err);
            setError("Image upload failed");
            setPreviewUrl(""); // Clear preview on error
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

            // Clean up empty images safely (images can be null for existing products)
            body.images = (body.images || []).filter((img: string) => img && img.trim() !== "");

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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm transition-all duration-300">
            <div className="bg-white dark:bg-neutral-900/80 dark:backdrop-blur-xl border border-transparent dark:border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-neutral-dark dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-neutral-400">
                    {isEdit ? "Edit Product" : "New Product"}
                </h2>

                {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                                Slug
                                {!isEdit && <span className="text-[10px] text-neutral-400 ml-1">(auto-generated from Spanish name)</span>}
                            </label>
                            <input
                                value={formData.slug}
                                onChange={e => handleChange("slug", slugify(e.target.value))}
                                className="w-full border dark:border-neutral-700 rounded p-2 font-mono text-sm bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                placeholder="e.g. crema-facial-hidratante"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">SKU</label>
                            <input
                                value={formData.sku || ""}
                                onChange={e => handleChange("sku", e.target.value)}
                                className="w-full border dark:border-neutral-700 rounded p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={e => handleChange("categoryId", Number(e.target.value))}
                                className="w-full border dark:border-neutral-700 rounded p-2 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name['es-CL'] || c.name['en']}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Base Price (Global)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => handleChange("price", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => handleChange("stock", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t dark:border-neutral-800 pt-4">
                        <h3 className="font-bold mb-2 text-neutral-dark dark:text-white">Regional Pricing</h3>
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
                                        className="w-full border dark:border-neutral-700 rounded p-2 text-sm bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t dark:border-neutral-800 pt-4">
                        <h3 className="font-bold mb-2 text-neutral-dark dark:text-white">Localization</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Name (ES)</label>
                                <input
                                    value={formData.name['es-CL']}
                                    onChange={e => handleNestedChange("name", "es-CL", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Name (EN)</label>
                                <input
                                    value={formData.name['en']}
                                    onChange={e => handleNestedChange("name", "en", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Description (ES)</label>
                                <textarea
                                    value={formData.description['es-CL']}
                                    onChange={e => handleNestedChange("description", "es-CL", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 h-20 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Description (EN)</label>
                                <textarea
                                    value={formData.description['en']}
                                    onChange={e => handleNestedChange("description", "en", e.target.value)}
                                    className="w-full border dark:border-neutral-700 rounded p-2 h-20 bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">Product Image</label>
                        <div className="flex gap-4 items-center">
                            {previewUrl && (
                                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded border dark:border-neutral-700" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-neutral-600 dark:text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 dark:file:bg-brand-green dark:hover:file:bg-brand-green-dark cursor-pointer"
                                disabled={uploading}
                            />
                            {uploading && <span className="text-xs text-neutral-500">Uploading...</span>}
                        </div>
                        {/* Fallback URL input */}
                        <input
                            value={formData.images?.[0] || ""}
                            onChange={e => setFormData(p => ({ ...p, images: [e.target.value] }))}
                            className="w-full border dark:border-neutral-700 rounded p-2 mt-2 text-xs text-neutral-400 dark:text-neutral-500 bg-white dark:bg-neutral-800"
                            placeholder="Or enter image URL directly"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-black dark:bg-brand-green text-white rounded hover:bg-gray-800 dark:hover:bg-brand-green-dark disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
