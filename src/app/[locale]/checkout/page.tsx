"use client";

import { useCartStore } from "@/lib/store/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/lib/utils";

const checkoutSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().min(6, "Phone is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage({ locale }: { locale: string }) {
    const { items, totalJson, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: session?.user?.name || "",
            email: session?.user?.email || "",
            country: "Chile", // Default based on locale usually
        }
    });

    useEffect(() => {
        setMounted(true);
        if (session?.user) {
            form.setValue("fullName", session.user.name || "");
            form.setValue("email", session.user.email || "");
        }
    }, [session, form]);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <button onClick={() => router.push('/')} className="text-brand-red font-bold hover:underline">
                    Continue Shopping
                </button>
            </div>
        )
    }

    const onSubmit = async (data: CheckoutForm) => {
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items,
                    shippingInfo: data,
                    total: totalJson(),
                    locale: locale
                }),
            });

            if (!res.ok) {
                throw new Error("Checkout failed");
            }

            const result = await res.json();

            clearCart();
            router.push(`/checkout/success?orderId=${result.orderId}`);

        } catch (err) {
            console.error(err);
            setError("There was a problem placing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold font-heading text-neutral-dark mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-med">
                        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <input {...form.register("fullName")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                    {form.formState.errors.fullName && <p className="text-red-500 text-xs mt-1">{form.formState.errors.fullName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input {...form.register("email")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                    {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input {...form.register("address")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                {form.formState.errors.address && <p className="text-red-500 text-xs mt-1">{form.formState.errors.address.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input {...form.register("city")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                    {form.formState.errors.city && <p className="text-red-500 text-xs mt-1">{form.formState.errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country</label>
                                    <input {...form.register("country")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                    {form.formState.errors.country && <p className="text-red-500 text-xs mt-1">{form.formState.errors.country.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input {...form.register("phone")} className="w-full px-4 py-2 rounded-lg border border-neutral-med" />
                                    {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-brand-red rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-premium bg-brand-red text-white hover:bg-brand-red-dark mt-4 disabled:opacity-70"
                            >
                                {isSubmitting ? "Processing..." : "Place Order"}
                            </button>
                            <p className="text-xs text-center text-neutral-400 mt-2">
                                This is a demo checkout. No payment is required.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-neutral-soft p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span className="font-medium">{formatCurrency(item.price * item.quantity, "CLP", locale)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-neutral-300 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(totalJson(), "CLP", locale)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
