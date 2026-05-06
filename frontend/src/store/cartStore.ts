import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ingredient {
  id: string;
  name: string;
  price: string | number;
  category?: string;
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
  id: string; // Product ID or unique ID for custom items
  product?: Product;
  isCustom?: boolean;
  name: string;
  brand: string;
  ingredients?: Ingredient[];
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          // Custom ürünler her zaman yeni bir kalem olarak eklenebilir veya 
          // eğer içerikleri birebir aynıysa adet artırılabilir. 
          // Şimdilik ID üzerinden gidiyoruz (DIY'da unique ID üreteceğiz).
          const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);
          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;
            return { items: updatedItems };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },
      updateQuantity: (id, delta) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
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
