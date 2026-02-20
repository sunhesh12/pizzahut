import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
    image_path?: string | null;
    size: string;
    toppings: string[];
    cartKey: string; // Unique key: id-size-toppings
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity' | 'cartKey'>) => void;
    removeItem: (cartKey: string) => void;
    updateQuantity: (cartKey: string, quantity: number) => void;
    clearCart: () => void;
}

const generateCartKey = (id: number, size: string, toppings: string[]) => {
    return `${id}-${size}-${[...toppings].sort().join(',')}`;
};

const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => {
                const cartKey = generateCartKey(item.id, item.size, item.toppings);
                const existingIndex = state.items.findIndex((i) => i.cartKey === cartKey);

                if (existingIndex > -1) {
                    const newItems = [...state.items];
                    newItems[existingIndex] = {
                        ...newItems[existingIndex],
                        quantity: newItems[existingIndex].quantity + 1
                    };
                    return { items: newItems };
                }

                return { items: [...state.items, { ...item, quantity: 1, cartKey }] };
            }),
            removeItem: (cartKey) => set((state) => ({
                items: state.items.filter((i) => i.cartKey !== cartKey)
            })),
            updateQuantity: (cartKey, quantity) => set((state) => ({
                items: state.items
                    .map((i) => (i.cartKey === cartKey ? { ...i, quantity: Math.max(0, quantity) } : i))
                    .filter((i) => i.quantity > 0),
            })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'pizza-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const useCart = () => {
    const store = useCartStore();

    const total = store.items.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
    );

    return {
        ...store,
        total
    };
};
