import Link from "next/link";
import { getBusinessSettings } from "@/lib/content";

export default async function Footer() {
  const business = await getBusinessSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-display text-lg font-bold mb-2">{business.name}</p>
          <p className="text-sm opacity-60">{business.description}</p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-40">Links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:opacity-60 transition-opacity">Shop</Link></li>
            <li><Link href="/about" className="hover:opacity-60 transition-opacity">About</Link></li>
            <li><Link href="/contact" className="hover:opacity-60 transition-opacity">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold mb-3 uppercase tracking-wider opacity-40">Contact</p>
          <ul className="space-y-2 text-sm opacity-70">
            <li>{business.phone}</li>
            <li>{business.email}</li>
            <li>{business.address}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-6 text-xs opacity-30">
        © {year} {business.name}. All rights reserved.
      </div>
    </footer>
  );
}
