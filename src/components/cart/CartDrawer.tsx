"use client";

import { useCartStore } from "@/lib/store/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartDrawer({ locale }: { locale: string }) {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Hydration fix for persistent store
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-[99]"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform duration-300 ease-out flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-neutral-med flex items-center justify-between">
                    <h2 className="text-xl font-heading font-bold text-neutral-dark flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart ({items.length})
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-neutral-soft rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-neutral-soft rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-neutral-400" />
                            </div>
                            <p className="text-neutral-500 font-medium">Your cart is empty</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-brand-green font-bold hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 border border-neutral-med rounded-xl hover:border-brand-green/30 transition-colors">
                                <div className="relative w-20 h-20 bg-neutral-soft rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-bold text-sm text-neutral-dark line-clamp-2">{item.name}</h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-neutral-400 hover:text-brand-green transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-neutral-soft rounded-full px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-brand-green transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-brand-green transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-neutral-dark">
                                            {formatCurrency(item.price * item.quantity, "CLP", locale)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-neutral-med space-y-4 bg-neutral-soft/30">
                        <div className="flex items-center justify-between text-lg font-bold text-neutral-dark">
                            <span>Total</span>
                            <span>{formatCurrency(total, "CLP", locale)}</span>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/checkout");
                            }}
                            className="w-full btn-premium bg-brand-green text-white hover:bg-brand-green-dark shadow-lg shadow-brand-green/20"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
