"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";

interface AdminOrderModalProps {
    order: any;
    locale: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminOrderModal({ order, locale, onClose, onSuccess }: AdminOrderModalProps) {
    const [status, setStatus] = useState(order.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statuses = ["pending", "received", "in progress", "on delivery", "completed", "cancelled"];
    const shipping = order.shippingInfo as any;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === order.status) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id, status })
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to update status");
            }
        } catch (e) {
            alert("Error updating status");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-neutral-200 dark:border-white/10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold font-heading mb-6 text-neutral-dark dark:text-white">Order Details</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Order ID</span>
                            <div className="font-mono text-lg font-bold text-neutral-dark dark:text-neutral-200">#{order.id}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">Customer</span>
                                <div className="font-bold text-neutral-dark dark:text-neutral-200">{shipping.fullName}</div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-300">{shipping.email}</div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-300">{shipping.phone}</div>
                            </div>
                            <div>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">Date</span>
                                <div className="font-bold text-neutral-dark dark:text-neutral-200" suppressHydrationWarning>{new Date(order.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount</span>
                            <div className="text-xl font-bold text-brand-green">
                                {formatCurrency(order.total, getCurrencyForLocale(locale), locale)}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-neutral-200 dark:border-white/10 pt-6">
                        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">Update Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 rounded-lg border border-neutral-300 dark:border-white/10 bg-neutral-50 dark:bg-black/50 text-black dark:text-white mb-6 focus:ring-2 focus:ring-brand-green outline-none transition-all"
                        >
                            {statuses.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg border border-neutral-300 dark:border-white/10 font-bold text-neutral-700 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black dark:brand-gradient-bg text-white px-5 py-2.5 rounded-lg font-bold hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-md"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
