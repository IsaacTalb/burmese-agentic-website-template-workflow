import Link from "next/link";
import { getBusinessSettings, getThemeSettings } from "@/lib/content";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default async function Navbar() {
  const [business, theme] = await Promise.all([getBusinessSettings(), getThemeSettings()]);

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-sm border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight" style={{ color: "var(--brand-accent)" }}>
          {theme.logo.text || business.name}
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/shop" className="hover:opacity-60 transition-opacity">Shop</Link>
          <Link href="/about" className="hover:opacity-60 transition-opacity">About</Link>
          <Link href="/contact" className="hover:opacity-60 transition-opacity">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://t.me/${business.social.telegram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Telegram"
          >
            <MessageCircle size={20} />
          </a>
          <Link href="/shop" className="p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Shop">
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
