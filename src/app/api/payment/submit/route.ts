import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderId } from "@/lib/utils";
import { generateR2Key } from "@/lib/cloudflare/r2";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const screenshot = formData.get("screenshot") as File;
    const orderData = JSON.parse(formData.get("form") as string);
    const productId = formData.get("productId") as string;
    const productName = formData.get("productName") as string;
    const total = parseInt(formData.get("total") as string);

    const orderId = generateOrderId();
    const supabase = await createClient();
    const screenshotKey = generateR2Key("payment-screenshots", screenshot.name);

    const { error } = await supabase.from("orders").insert({
      id: orderId,
      status: "pending",
      customer_name: orderData.name,
      customer_phone: orderData.phone,
      customer_address: orderData.address,
      customer_township: orderData.township,
      customer_city: orderData.city,
      product_id: productId,
      product_name: productName,
      delivery_option: orderData.delivery,
      payment_method: orderData.paymentMethod,
      payment_screenshot_key: screenshotKey,
      total,
      notes: orderData.notes,
    });

    if (error) throw error;

    return NextResponse.json({ orderId, success: true });
  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
