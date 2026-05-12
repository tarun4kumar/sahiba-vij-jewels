import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { formatINR } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Sahiba Vij" }] }),
  component: AdminPage,
});

const STAGES = ["Pending Confirmation", "Confirmed", "Packed", "Shipped", "Delivered"];

type Product = {
  id: string; name: string; slug: string; price: number; category: string;
  stock_count: number; is_featured: boolean; is_limited_edition: boolean;
  images: string[]; description: string | null; story: string | null;
  materials: string | null; care_info: string | null;
};

type Order = {
  id: string; order_id: string; customer_name: string; customer_phone: string;
  customer_address: string; customer_city: string; customer_state: string; customer_pincode: string;
  status: string; total: number; items: { name: string; quantity: number }[]; created_at: string;
};

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!session) return <AuthScreen />;
  if (isAdmin === null) return <Center>Checking access…</Center>;
  if (!isAdmin) return (
    <Center>
      <p className="font-serif text-2xl text-foreground mb-3">No admin access</p>
      <p className="text-foreground/70 mb-4 text-sm max-w-md">Your account is signed in but isn't marked as admin. Add your user ID to the <code className="bg-card px-1 rounded">admins</code> table from the backend dashboard.</p>
      <p className="text-xs text-muted-foreground mb-6">Your ID: <code className="bg-card px-1 rounded">{session.user.id}</code></p>
      <button onClick={() => supabase.auth.signOut()} className="text-sm text-gold border-b border-gold">Sign out</button>
    </Center>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-serif text-2xl text-foreground">Sahiba Vij</Link>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/70 hidden md:inline">{session.user.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-sm text-gold border-b border-gold">Sign out</button>
          </div>
        </div>
        <div className="container mx-auto px-4 flex gap-2">
          {(["orders", "products"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm tracking-wider uppercase border-b-2 -mb-px ${tab === t ? "border-gold text-foreground" : "border-transparent text-foreground/60"}`}>{t}</button>
          ))}
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {tab === "orders" ? <OrdersTab /> : <ProductsTab />}
      </div>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setLoading(false);
    if (error) toast.error(error.message);
    else if (mode === "signup") toast.success("Account created. Check your email to confirm.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-card rounded-md p-8">
        <h1 className="font-serif text-3xl text-foreground mb-2">Admin Access</h1>
        <p className="text-sm text-foreground/70 mb-6">{mode === "signin" ? "Sign in to manage products and orders." : "Create an admin account."}</p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-background border border-border mb-3 focus:outline-none focus:border-gold" />
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl bg-background border border-border mb-5 focus:outline-none focus:border-gold" />
        <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-full text-sm tracking-[0.2em] uppercase">{loading ? "…" : mode === "signin" ? "Sign In" : "Sign Up"}</button>
        <p className="text-center text-sm mt-4 text-foreground/60">
          {mode === "signin" ? "Need an account?" : "Have an account?"}{" "}
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-gold border-b border-gold">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">{children}</div>;
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as unknown as Order[]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); refresh(); }
  };

  if (loading) return <p className="text-center py-12 text-muted-foreground">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-center py-12 text-muted-foreground italic font-serif">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="bg-card rounded-md p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <div>
              <p className="font-serif text-xl text-foreground">{o.order_id}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</p>
            </div>
            <p className="text-lg font-medium">{formatINR(Number(o.total))}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold mb-1">Customer</p>
              <p>{o.customer_name}</p>
              <p className="text-foreground/70">{o.customer_phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold mb-1">Address</p>
              <p className="text-foreground/80">{o.customer_address}, {o.customer_city}, {o.customer_state} - {o.customer_pincode}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold mb-1">Items</p>
              <ul className="text-foreground/80">{o.items.map((it, i) => <li key={i}>{it.name} × {it.quantity}</li>)}</ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
            <span className="text-xs uppercase tracking-wider text-foreground/60">Status:</span>
            <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="px-3 py-1.5 rounded-full bg-background border border-border text-sm focus:outline-none focus:border-gold">
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const refresh = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  };
  useEffect(() => { refresh(); }, []);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name")),
      slug: String(fd.get("slug")),
      price: Number(fd.get("price")),
      category: String(fd.get("category")),
      stock_count: Number(fd.get("stock_count")),
      is_featured: fd.get("is_featured") === "on",
      is_limited_edition: fd.get("is_limited_edition") === "on",
      description: String(fd.get("description") || ""),
      story: String(fd.get("story") || ""),
      materials: String(fd.get("materials") || ""),
      care_info: String(fd.get("care_info") || ""),
      images: String(fd.get("images") || "").split("\n").map((s) => s.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };
    const action = editing?.id
      ? supabase.from("products").update(payload).eq("id", editing.id)
      : supabase.from("products").insert(payload);
    const { error } = await action;
    if (error) toast.error(error.message);
    else { toast.success("Saved"); setEditing(null); refresh(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };

  if (editing) {
    const p = editing;
    return (
      <form onSubmit={save} className="bg-card rounded-md p-6 space-y-3 max-w-2xl">
        <h2 className="font-serif text-2xl text-foreground mb-2">{p.id ? "Edit" : "New"} Product</h2>
        <Input name="name" label="Name" defaultValue={p.name} required />
        <Input name="slug" label="Slug" defaultValue={p.slug} required />
        <div className="grid grid-cols-2 gap-3">
          <Input name="price" label="Price (₹)" type="number" defaultValue={p.price} required />
          <Input name="stock_count" label="Stock" type="number" defaultValue={p.stock_count ?? 0} required />
        </div>
        <Input name="category" label="Category (necklaces/earrings/rings/bangles/sets)" defaultValue={p.category} required />
        <Area name="description" label="Description" defaultValue={p.description ?? ""} />
        <Area name="story" label="Story (italic block on product page)" defaultValue={p.story ?? ""} />
        <Area name="materials" label="Materials" defaultValue={p.materials ?? ""} rows={2} />
        <Area name="care_info" label="Care Info" defaultValue={p.care_info ?? ""} rows={2} />
        <Area name="images" label="Image URLs (one per line)" defaultValue={(p.images ?? []).join("\n")} rows={3} />
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" defaultChecked={p.is_featured} /> Featured</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_limited_edition" defaultChecked={p.is_limited_edition} /> Limited</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm tracking-wider uppercase">Save</button>
          <button type="button" onClick={() => setEditing(null)} className="text-sm text-foreground/70 border-b border-border">Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <button onClick={() => setEditing({})} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm tracking-wider uppercase mb-6">+ Add Product</button>
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-card rounded-md p-4 flex gap-4">
            <img src={p.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-lg text-primary truncate">{p.name}</p>
              <p className="text-sm text-foreground/70">{formatINR(Number(p.price))} · Stock {p.stock_count}</p>
              <div className="flex gap-3 mt-2 text-sm">
                <button onClick={() => setEditing(p)} className="text-gold border-b border-gold">Edit</button>
                <button onClick={() => remove(p.id)} className="text-destructive border-b border-destructive">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-foreground/70 mb-1">{label}</span>
      <input {...props} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-gold" />
    </label>
  );
}
function Area({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-foreground/70 mb-1">{label}</span>
      <textarea rows={3} {...props} className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:outline-none focus:border-gold" />
    </label>
  );
}
