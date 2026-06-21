import { getProductById, getBusinessSettings, formatMMK } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import OrderForm from "@/components/payment/OrderForm";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, business] = await Promise.all([getProductById(id), getBusinessSettings()]);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/shop" className="text-sm opacity-40 hover:opacity-70 transition-opacity mb-8 inline-block">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-black/5 rounded-2xl overflow-hidden relative">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square bg-black/5 rounded-lg overflow-hidden relative">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info + Order */}
        <div>
          <p className="text-xs uppercase tracking-widest opacity-40 mb-1">{product.category}</p>
          <h1 className="font-display text-3xl font-bold mb-1">{product.name}</h1>
          <p className="opacity-50 mb-4">{product.nameMyanmar}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold" style={{ color: "var(--brand-accent)" }}>
              {formatMMK(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base line-through opacity-40">{formatMMK(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-sm opacity-70 leading-relaxed mb-2">{product.description}</p>
          <p className="text-sm opacity-50 leading-relaxed mb-8">{product.descriptionMyanmar}</p>

          {product.inStock ? (
            <OrderForm product={product} business={business} />
          ) : (
            <div className="rounded-xl border border-black/10 p-6 text-center text-sm opacity-50">
              This product is currently out of stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
