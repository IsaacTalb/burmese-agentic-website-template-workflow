"use client";

import { useState } from "react";
import type { Product, BusinessSettings, DeliveryOption } from "@/types";
import { Upload, CheckCircle, Copy } from "lucide-react";

type Step = "details" | "payment" | "upload" | "done";

interface OrderFormProps {
  product: Product;
  business: BusinessSettings;
}

export default function OrderForm({ product, business }: OrderFormProps) {
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    township: "",
    city: "",
    delivery: business.delivery.options[0]?.id ?? "",
    paymentMethod: "kbzpay" as "kbzpay" | "wavepay" | "cbpay",
    notes: "",
  });

  const selectedDelivery = business.delivery.options.find((d) => d.id === form.delivery) as DeliveryOption;
  const total = product.price + (selectedDelivery?.price ?? 0);

  const paymentNumbers: Record<string, string> = {
    kbzpay: business.payment.kbzpay,
    wavepay: business.payment.wavepay,
    cbpay: business.payment.cbpay,
  };

  const copyNumber = (num: string, key: string) => {
    navigator.clipboard.writeText(num);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentConfirm = () => {
    setStep("upload");
  };

  const handleUpload = async () => {
    if (!screenshot) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("screenshot", screenshot);
      formData.append("form", JSON.stringify(form));
      formData.append("productId", product.id);
      formData.append("productName", product.name);
      formData.append("total", total.toString());

      const res = await fetch("/api/payment/submit", { method: "POST", body: formData });
      const data = await res.json();
      setOrderId(data.orderId);
      setStep("done");
    } catch {
      alert("Something went wrong. Please try again or contact us on Telegram.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="rounded-2xl border border-black/10 p-8 text-center space-y-4">
        <CheckCircle className="mx-auto" style={{ color: "var(--brand-accent)" }} size={40} />
        <h3 className="font-display text-xl font-bold">Order Received!</h3>
        <p className="text-sm opacity-60">Order ID: <span className="font-mono font-bold">{orderId}</span></p>
        <p className="text-sm opacity-60">We will verify your payment and contact you at <strong>{form.phone}</strong> within 24 hours.</p>
        <a href={`https://t.me/${business.social.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
          className="inline-block text-sm underline underline-offset-4 opacity-50 hover:opacity-100 transition-opacity">
          Message us on Telegram for faster updates
        </a>
      </div>
    );
  }

  if (step === "payment") {
    const num = paymentNumbers[form.paymentMethod];
    return (
      <div className="space-y-5">
        <h3 className="font-semibold">Pay via {form.paymentMethod.toUpperCase()}</h3>
        <div className="rounded-2xl border border-black/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-60">Total to pay</span>
            <span className="font-bold text-lg" style={{ color: "var(--brand-accent)" }}>{total.toLocaleString()} MMK</span>
          </div>

          {/* Method selector */}
          <div className="flex gap-2">
            {(["kbzpay", "wavepay", "cbpay"] as const).filter((m) => paymentNumbers[m]).map((m) => (
              <button key={m} onClick={() => setForm({ ...form, paymentMethod: m })}
                className="px-3 py-1.5 rounded-full text-xs border transition-colors"
                style={form.paymentMethod === m
                  ? { background: "var(--brand-primary)", color: "var(--brand-secondary)", borderColor: "var(--brand-primary)" }
                  : { borderColor: "rgba(0,0,0,0.15)" }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {num && (
            <div className="flex items-center justify-between bg-black/5 rounded-xl px-4 py-3">
              <span className="font-mono font-bold text-lg">{num}</span>
              <button onClick={() => copyNumber(num, form.paymentMethod)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
                {copied === form.paymentMethod ? <CheckCircle size={16} style={{ color: "var(--brand-accent)" }} /> : <Copy size={16} />}
              </button>
            </div>
          )}

          <p className="text-xs opacity-50">{business.payment.instruction}</p>
        </div>

        <button onClick={handlePaymentConfirm}
          className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--brand-primary)", color: "var(--brand-secondary)" }}>
          I have paid — Upload Screenshot
        </button>
        <button onClick={() => setStep("details")} className="w-full text-sm opacity-40 hover:opacity-70 transition-opacity">
          ← Back
        </button>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div className="space-y-5">
        <h3 className="font-semibold">Upload Payment Screenshot</h3>
        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-black/20 rounded-2xl p-10 cursor-pointer hover:border-black/40 transition-colors">
          <Upload size={28} className="opacity-30" />
          <span className="text-sm opacity-50">{screenshot ? screenshot.name : "Click to upload screenshot"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)} />
        </label>

        <button onClick={handleUpload} disabled={!screenshot || loading}
          className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-30"
          style={{ background: "var(--brand-primary)", color: "var(--brand-secondary)" }}>
          {loading ? "Submitting..." : "Submit Order"}
        </button>
        <button onClick={() => setStep("payment")} className="w-full text-sm opacity-40 hover:opacity-70 transition-opacity">
          ← Back
        </button>
      </div>
    );
  }

  // Step: details
  return (
    <form onSubmit={handleSubmitDetails} className="space-y-4">
      <h3 className="font-semibold">Your Details</h3>

      {[
        { key: "name", label: "Full Name", placeholder: "ဦး/ဒေါ်..." },
        { key: "phone", label: "Phone Number", placeholder: "09..." },
        { key: "address", label: "Address", placeholder: "House No, Street..." },
        { key: "township", label: "Township", placeholder: "Township" },
        { key: "city", label: "City / Region", placeholder: "Yangon" },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="text-xs opacity-50 block mb-1">{label}</label>
          <input
            required
            type={key === "phone" ? "tel" : "text"}
            placeholder={placeholder}
            value={form[key as keyof typeof form] as string}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black/40 transition-colors bg-transparent"
          />
        </div>
      ))}

      {/* Delivery option */}
      <div>
        <label className="text-xs opacity-50 block mb-1">Delivery Option</label>
        <div className="space-y-2">
          {business.delivery.options.map((opt) => (
            <label key={opt.id} className="flex items-center justify-between border border-black/15 rounded-xl px-4 py-3 cursor-pointer hover:border-black/30 transition-colors">
              <div className="flex items-center gap-3">
                <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id}
                  onChange={() => setForm({ ...form, delivery: opt.id })} />
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs opacity-40">{opt.days === "0" ? "Pick up yourself" : `${opt.days} days`}</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{opt.price === 0 ? "Free" : `${opt.price.toLocaleString()} MMK`}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs opacity-50 block mb-1">Notes (optional)</label>
        <textarea
          placeholder="Any special instructions..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          className="w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black/40 transition-colors bg-transparent resize-none"
        />
      </div>

      {/* Order summary */}
      <div className="border-t border-black/10 pt-4 space-y-1 text-sm">
        <div className="flex justify-between opacity-60">
          <span>{product.name} × 1</span>
          <span>{product.price.toLocaleString()} MMK</span>
        </div>
        <div className="flex justify-between opacity-60">
          <span>Delivery</span>
          <span>{selectedDelivery?.price === 0 ? "Free" : `${selectedDelivery?.price.toLocaleString()} MMK`}</span>
        </div>
        <div className="flex justify-between font-bold pt-1">
          <span>Total</span>
          <span style={{ color: "var(--brand-accent)" }}>{total.toLocaleString()} MMK</span>
        </div>
      </div>

      <button type="submit"
        className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ background: "var(--brand-primary)", color: "var(--brand-secondary)" }}>
        Continue to Payment →
      </button>
    </form>
  );
}
