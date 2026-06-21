import { auth, currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const user = await currentUser();
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
        <p className="text-sm opacity-50">{user?.emailAddresses[0]?.emailAddress}</p>
      </div>

      <h2 className="font-semibold mb-4">Recent Orders</h2>

      {!orders?.length ? (
        <p className="opacity-40 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-black/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-bold">{order.id}</p>
                <p className="text-sm opacity-60">{order.customer_name} · {order.customer_phone}</p>
                <p className="text-xs opacity-40">{order.product_name} · {order.delivery_option}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.total?.toLocaleString()} MMK</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  order.status === "verified" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
