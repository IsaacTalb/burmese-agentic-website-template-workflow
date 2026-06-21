import { getProducts, formatMMK } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="aspect-square bg-black/5 rounded-xl overflow-hidden mb-3 relative">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-sm">No image</div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Sold Out</span>
          </div>
        )}
      </div>
      <p className="font-medium text-sm">{product.name}</p>
      <p className="text-xs opacity-50 mb-1">{product.nameMyanmar}</p>
      <span className="text-sm font-bold" style={{ color: "var(--brand-accent)" }}>{formatMMK(product.price)}</span>
      {product.originalPrice && (
        <span className="text-xs line-through opacity-40 ml-2">{formatMMK(product.originalPrice)}</span>
      )}
    </Link>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const { categories, products } = await getProducts();
  const filtered = category && category !== "All" ? products.filter((p) => p.category === category) : products;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Shop</h1>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-10">
        {["All", ...categories.filter((c) => c !== "All")].map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/shop" : `/shop?category=${encodeURIComponent(cat)}`}
            className="px-4 py-1.5 rounded-full text-sm border transition-colors"
            style={
              (category ?? "All") === cat
                ? { background: "var(--brand-primary)", color: "var(--brand-secondary)", borderColor: "var(--brand-primary)" }
                : { borderColor: "rgba(0,0,0,0.15)" }
            }
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="opacity-40 text-sm">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
