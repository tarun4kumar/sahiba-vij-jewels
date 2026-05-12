import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/brand";
import { useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Sahiba Vij Jewellery" },
      { name: "description", content: "Browse our collection of necklaces, earrings, rings, bangles, and bridal sets in micron gold polish." },
      { property: "og:title", content: "Shop — Sahiba Vij" },
      { property: "og:description", content: "Story-driven Indian jewellery." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [cat, setCat] = useState<string>("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", cat],
    queryFn: async () => {
      let q = supabase.from("products").select("*").order("created_at", { ascending: false });
      if (cat !== "all") q = q.eq("category", cat);
      const { data } = await q;
      return (data ?? []) as Product[];
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">The Collection</p>
        <h1 className="font-serif text-4xl md:text-6xl text-foreground">Shop All</h1>
        <div className="gold-divider w-24 mx-auto mt-5" />
      </div>

      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all ${
              cat === c.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground/70 hover:bg-secondary border border-border"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-20">Loading…</p>
      ) : products && products.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 italic font-serif text-xl">
          Nothing in this category yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
          {(products ?? []).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
