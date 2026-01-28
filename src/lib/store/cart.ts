import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: number; // Product ID
    slug: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    toggleCart: () => void;

    // Getters
    totalJson: () => number;
    itemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === newItem.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true,
                    });
                } else {
                    set({
                        items: [...items, { ...newItem, quantity: 1 }],
                        isOpen: true,
                    });
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) {
                    get().removeItem(id);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            setIsOpen: (isOpen) => set({ isOpen }),
            toggleCart: () => set({ isOpen: !get().isOpen }),

            totalJson: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
            itemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
        }),
        {
            name: 'bellavida-cart-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist items, not isOpen state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
