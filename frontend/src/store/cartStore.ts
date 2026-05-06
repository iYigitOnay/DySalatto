import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ingredient {
  id: string;
  name: string;
  price: string | number;
  category?: any;
}

export interface Product {
  id: string;
  name: string;
  price: string | number;
  image?: string;
  brand: string;
  category?: string | any;
}

export interface CartItem {
  id: string; // Unique ID for each item in cart (can be productId or a random string for custom items)
  productId?: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
  brand: string;
  isCustom: boolean;
  ingredients?: Ingredient[];
  removedIngredients?: string[]; // IDs of ingredients removed from standard recipe
  product?: Product; // Reference to original product details
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          // If it's a custom item (DIY or Customized Ready-made), always add as new item
          if (newItem.isCustom) {
            return { items: [...state.items, { ...newItem, id: Math.random().toString(36).substr(2, 9) }] };
          }

          // For standard products, check if already in cart
          const existingItemIndex = state.items.findIndex(
            (item) => !item.isCustom && item.productId === newItem.productId
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
      },
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'dysalatto-cart-v1',
    }
  )
);
