// ============================================
// Content loader — reads from /content/ JSON files
// This is how the app consumes agent-edited content
// ============================================

import type { BusinessSettings, ThemeSettings, Product } from "@/types";

// In Next.js App Router, JSON imports work at build time
// For dynamic updates without redeploy, swap these for Supabase reads

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const data = await import("../../content/settings/business.json");
  return data.default as BusinessSettings;
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  const data = await import("../../content/settings/theme.json");
  return data.default as ThemeSettings;
}

export async function getHomePage() {
  const data = await import("../../content/pages/home.json");
  return data.default;
}

export async function getAboutPage() {
  const data = await import("../../content/pages/about.json");
  return data.default;
}

export async function getProducts(): Promise<{ categories: string[]; products: Product[] }> {
  const data = await import("../../content/products/catalog.json");
  return data.default as { categories: string[]; products: Product[] };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { products } = await getProducts();
  return products.filter((p) => p.featured && p.inStock);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { products } = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

export function formatMMK(amount: number): string {
  return `${amount.toLocaleString()} MMK`;
}
