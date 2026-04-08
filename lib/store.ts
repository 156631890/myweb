import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, WishlistItem } from "@/types";

interface CouponResult {
  success: boolean;
  message?: string;
}

interface CartStore {
  items: CartItem[];
  coupon: string | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  getTotalItems: () => number;
  applyCoupon: (couponCode: string) => CouponResult;
  removeCoupon: () => void;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

interface UIStore {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isCartOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleCart: () => void;
  closeAll: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [], coupon: null }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      getTotalItems: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      applyCoupon: (couponCode) => {
        // Simple validation - in real app, this would be an API call
        const validCoupons = ['LUXE10', 'WELCOME20', 'SUMMER15'];
        if (validCoupons.includes(couponCode.toUpperCase())) {
          set({ coupon: couponCode.toUpperCase() });
          return { success: true, message: 'Coupon applied successfully!' };
        }
        return { success: false, message: 'Invalid coupon code' };
      },
      removeCoupon: () => {
        set({ coupon: null });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        const items = get().items;
        if (!items.some((item) => item.productId === productId)) {
          set({ items: [...items, { productId, addedAt: new Date() }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUIStore = create<UIStore>()((set) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isCartOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  closeAll: () => set({ isSidebarOpen: false, isMobileMenuOpen: false, isCartOpen: false }),
}));

// Cart totals helper hook
export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const coupon = useCartStore((state) => state.coupon);

  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = coupon ? subtotal * 0.1 : 0; // 10% discount for coupon
  const tax = subtotal * 0.08; // 8% tax
  const FREE_SHIPPING_THRESHOLD = 200;
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = hasFreeShipping ? 0 : 15;
  const total = subtotal - discount + tax + shipping;

  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    hasFreeShipping,
    amountForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
};
