export type CategorySlug =
  | "sunglasses"
  | "women-clothes"
  | "men-clothes"
  | "bags"
  | "shoes"
  | "jewelry";

export type ViewMode = "retail" | "trade";

export interface Color {
  name: string;
  hex: string;
  image?: string;
}

export interface SourceRef {
  label: string;
  url: string;
  note?: string;
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface ProductDetailSection {
  heading: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: CategorySlug;
  categoryLabel: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  wholesalePrice?: number;
  minimumOrderQty?: number;
  images: string[];
  colors: Color[];
  sizes?: string[];
  features: string[];
  materials?: string[];
  origin?: string;
  fit?: string;
  pageTitle?: string;
  itemNumber?: string;
  manufacturerDetails?: string;
  productDetails?: string;
  sizeAndFit?: string;
  audience?: "women" | "men" | "unisex";
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  highlight?: string;
  source: SourceRef;
  shareText: string;
  seo: ProductSeo;
}

export interface CategoryInfo {
  id: CategorySlug;
  name: string;
  description: string;
  image: string;
  accent: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: Color | string;
  selectedSize?: string;
}

export interface CartItemWithSelection {
  product: Product;
  quantity: number;
  selectedColor: Color;
  selectedSize?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface FilterOptions {
  categories: CategorySlug[];
  priceRange: [number, number];
  colors: string[];
  inStockOnly: boolean;
}

export type SortOption = "newest" | "price-low" | "price-high" | "popular";

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

export interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; discount: number; message?: string };
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: "card" | "paypal";
  cardLast4?: string;
}

export interface CheckoutState {
  step: "customer" | "shipping" | "payment" | "review" | "complete";
  customerInfo: CustomerInfo | null;
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  isProcessing: boolean;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface WholesaleInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  country?: string;
  items: string;
  quantity?: string;
  notes?: string;
  sourceUrl?: string;
  createdAt: string;
}
