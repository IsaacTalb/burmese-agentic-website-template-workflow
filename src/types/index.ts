// ============================================
// Core types — mirrors content JSON structure
// ============================================

export interface Product {
  id: string;
  name: string;
  nameMyanmar: string;
  category: string;
  price: number;
  originalPrice?: number;
  currency: "MMK";
  description: string;
  descriptionMyanmar: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface DeliveryOption {
  id: string;
  label: string;
  price: number;
  days: string;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  social: {
    facebook: string;
    instagram: string;
    telegram: string;
  };
  payment: {
    kbzpay: string;
    wavepay: string;
    cbpay: string;
    instruction: string;
  };
  delivery: {
    options: DeliveryOption[];
  };
}

export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  logo: {
    text: string;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "verified" | "processing" | "shipped" | "delivered" | "cancelled";
  customer: {
    name: string;
    phone: string;
    address: string;
    township: string;
    city: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  delivery: DeliveryOption;
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: {
    method: "kbzpay" | "wavepay" | "cbpay";
    screenshotUrl: string;
    verified: boolean;
  };
  notes: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
