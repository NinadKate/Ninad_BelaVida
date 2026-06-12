"use client";

import { useCartStore } from "@/lib/store/cart";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency, getCurrencyForLocale } from "@/lib/utils";
import { COUNTRIES } from "@/constants/countries";

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
          <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
            Your cart is empty
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-brand-green font-bold hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      );
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
            locale: locale,
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          throw new Error(errorBody?.error || "Checkout failed");
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
        <h1 className="text-3xl font-bold font-heading text-neutral-dark dark:text-neutral-100 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-med dark:border-white/10">
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                Shipping Information
              </h2>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                      Full Name
                    </label>
                    <input
                      {...form.register("fullName")}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                      Email
                    </label>
                    <input
                      {...form.register("email")}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                    Address
                  </label>
                  <input
                    {...form.register("address")}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                      City
                    </label>
                    <input
                      {...form.register("city")}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                    {form.formState.errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                      Country
                    </label>
                    <select
                      {...form.register("country")}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.country.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-300">
                      Phone
                    </label>
                    <div className="relative">
                      {form.watch("country") &&
                        COUNTRIES.find(
                          (c) => c.name === form.watch("country"),
                        ) && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                            {
                              COUNTRIES.find(
                                (c) => c.name === form.watch("country"),
                              )?.phoneCode
                            }
                          </span>
                        )}
                      <input
                        {...form.register("phone")}
                        placeholder="Phone number"
                        className={`w-full px-4 py-2 rounded-lg border border-neutral-med dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-brand-green focus:outline-none transition-all ${form.watch("country") && COUNTRIES.find((c) => c.name === form.watch("country"))?.phoneCode ? "pl-12" : ""}`}
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800/30">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-premium brand-gradient-bg text-white hover:opacity-90 mt-4 disabled:opacity-70"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
                <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-2">
                  Place your order, our team will contact you to confirm the details and contact you regarding payment.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-soft dark:bg-neutral-900 p-6 rounded-2xl sticky top-24 border border-transparent dark:border-white/10">
              <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(
                        item.price * item.quantity,
                        getCurrencyForLocale(locale),
                        locale,
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-300 dark:border-white/10 pt-4 flex justify-between font-bold text-lg text-neutral-900 dark:text-neutral-100">
                <span>Total</span>
                <span>
                  {formatCurrency(
                    totalJson(),
                    getCurrencyForLocale(locale),
                    locale,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
