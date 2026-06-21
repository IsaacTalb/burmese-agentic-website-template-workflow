import Link from "next/link";
import Image from "next/image";
import { getHomePage, getFeaturedProducts, getBusinessSettings, formatMMK } from "@/lib/content";
import type { Product } from "@/types";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="aspect-square bg-black/5 rounded-xl overflow-hidden mb-3 relative">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-sm">No image</div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Sold Out</span>
          </div>
        )}
      </div>
      <p className="font-medium text-sm leading-tight">{product.name}</p>
      <p className="text-xs opacity-50 mb-1">{product.nameMyanmar}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: "var(--brand-accent)" }}>
          {formatMMK(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-xs line-through opacity-40">{formatMMK(product.originalPrice)}</span>
        )}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [home, featured, business] = await Promise.all([
    getHomePage(),
    getFeaturedProducts(),
    getBusinessSettings(),
  ]);

  return (
    <>
      {/* Announcement Bar */}
      {home.announcement.enabled && (
        <div className="text-center py-2 px-4 text-sm" style={{ background: "var(--brand-accent)", color: "var(--brand-secondary)" }}>
          {home.announcement.text}
        </div>
      )}

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 text-balance">
            {home.hero.headline.split("\n").map((line: string, i: number) => (
              <span key={i} className={i === 1 ? "block" : ""} style={i === 1 ? { color: "var(--brand-accent)" } : {}}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lg opacity-60 mb-8 max-w-md">{home.hero.subheadline}</p>
          <Link
            href={home.hero.ctaUrl}
            className="inline-block px-8 py-3 text-sm font-semibold uppercase tracking-wider rounded-full transition-opacity hover:opacity-80"
            style={{ background: "var(--brand-primary)", color: "var(--brand-secondary)" }}
          >
            {home.hero.cta}
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-40 mb-1">{home.featured.subtitle}</p>
              <h2 className="font-display text-3xl font-bold">{home.featured.title}</h2>
            </div>
            <Link href="/shop" className="text-sm underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Payment Info strip */}
      <section className="border-y border-black/10 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-sm opacity-60">
          <span>✓ KBZPay / Wave / CBPay</span>
          <span>✓ Screenshot payment verification</span>
          <span>✓ Delivery across Myanmar</span>
          <span>✓ {business.phone}</span>
        </div>
      </section>

      {/* About preview */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">{home.about_preview.title}</h2>
        <p className="max-w-lg mx-auto opacity-60 mb-6">{home.about_preview.body}</p>
        <Link href={home.about_preview.ctaUrl} className="text-sm underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity">
          {home.about_preview.cta}
        </Link>
      </section>
    </>
  );
}
