"use client";

import { useCartStore } from "@/lib/store/cart";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
    product: {
        id: number;
        slug: string;
        name: string;
        price: number;
        image: string;
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <button
            onClick={() => addItem(product)}
            className="w-full md:w-auto px-8 py-3 bg-brand-green text-white font-bold rounded-full hover:bg-brand-green-dark transition-colors shadow-lg shadow-brand-green/20 transform active:scale-95 duration-200 flex items-center justify-center gap-2"
        >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
        </button>
    );
}
