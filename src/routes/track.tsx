import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/cart";
import { Check, Circle } from "lucide-react";

const STAGES = ["Pending Confirmation", "Confirmed", "Packed", "Shipped", "Delivered"] as const;

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track Order — Sahiba Vij" }] }),
  component: TrackPage,
});

type OrderRow = {
  order_id: string;
  customer_name: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
  created_at: string;
};

function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setOrder(null);
    setLoading(true);
    const { data, error } = await supabase.rpc("track_order", {
      _order_id: orderId.trim(),
      _phone: phone.trim(),
    });
    setLoading(false);
    if (error || !data || data.length === 0) {
      setErr("No order found with these details. Check your Order ID and phone.");
      return;
    }
    setOrder(data[0] as unknown as OrderRow);
  };

  const currentIdx = order ? STAGES.indexOf(order.status as (typeof STAGES)[number]) : -1;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Track Your Order</p>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground">Where is my sparkle?</h1>
        <div className="gold-divider w-24 mx-auto mt-5" />
      </div>

      <form onSubmit={lookup} className="bg-card rounded-md p-6 md:p-8 space-y-4 mb-8">
        <label className="block">
          <span className="block text-xs tracking-[0.2em] uppercase text-foreground/70 mb-2">Order ID</span>
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} required placeholder="SV-YYYYMMDD-XXXX" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-gold" />
        </label>
        <label className="block">
          <span className="block text-xs tracking-[0.2em] uppercase text-foreground/70 mb-2">Phone Number</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required pattern="[0-9]{10}" inputMode="numeric" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-gold" />
        </label>
        <button disabled={loading} className="w-full bg-primary text-primary-foreground py-4 rounded-full text-sm tracking-[0.2em] uppercase hover:bg-gold-soft disabled:opacity-50">
          {loading ? "Looking up…" : "Track Order"}
        </button>
        {err && <p className="text-sm text-destructive text-center">{err}</p>}
      </form>

      {order && (
        <div className="bg-card rounded-md p-6 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between mb-2 gap-2">
            <h2 className="font-serif text-2xl text-foreground">{order.order_id}</h2>
            <span className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
          </div>
          <p className="text-foreground/70 mb-8">For {order.customer_name} · {formatINR(Number(order.total))}</p>

          <ol className="space-y-4 mb-8">
            {STAGES.map((stage, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <li key={stage} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${done ? "bg-gold text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm tracking-wider uppercase ${active ? "text-primary font-medium" : done ? "text-foreground/80" : "text-muted-foreground"}`}>{stage}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Items</p>
            <ul className="text-sm text-foreground/80 space-y-1">
              {order.items.map((it, i) => <li key={i}>{it.name} × {it.quantity}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
