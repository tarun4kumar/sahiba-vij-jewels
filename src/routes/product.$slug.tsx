import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { cart, formatINR } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Sparkles } from "lucide-react";

type FullProduct = Product & {
  description: string | null;
  story: string | null;
  materials: string | null;
  care_info: string | null;
};

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      return data as FullProduct | null;
    },
  });

  const { data: related } = useQuery({
    queryKey: ["related", product?.category],
    enabled: !!product,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", product!.category)
        .neq("id", product!.id)
        .limit(4);
      return (data ?? []) as Product[];
    },
  });

  if (isLoading) return <div className="container py-32 text-center">Loading…</div>;
  if (!product) return <div className="container py-32 text-center font-serif text-2xl">Piece not found.</div>;

  const soldOut = product.stock_count <= 0;
  const lowStock = !soldOut && product.stock_count < 5;

  const addToCart = () => {
    cart.add({ id: product.id, name: product.name, slug: product.slug, price: Number(product.price), image: product.images[0] });
    toast.success("Added to cart ✦");
  };

  const notifyMe = () => {
    toast.success("We'll notify you when this beauty is back!");
  };

  return (
    <div>
      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square rounded-md overflow-hidden bg-card relative">
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              {soldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                  <span className="bg-gold text-accent-foreground font-serif text-xl tracking-[0.3em] uppercase px-8 py-3 rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-gold" : "border-transparent opacity-70"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3 capitalize">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{product.name}</h1>
            <p className="text-2xl text-foreground/90 mb-6">{formatINR(Number(product.price))}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-gold text-accent-foreground text-xs tracking-wider uppercase px-3 py-1.5 rounded-full font-medium">
                <Sparkles className="w-3 h-3" /> Micron Gold Polish
              </span>
              {product.is_limited_edition && (
                <span className="border border-gold text-gold text-xs tracking-wider uppercase px-3 py-1.5 rounded-full">
                  Limited Edition
                </span>
              )}
              {lowStock && (
                <span className="text-xs italic text-wine py-1.5">Only {product.stock_count} left</span>
              )}
            </div>

            {product.story && (
              <blockquote className="border-l-2 border-gold pl-5 my-8 font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed">
                "{product.story}"
              </blockquote>
            )}

            {product.description && (
              <p className="text-foreground/75 leading-relaxed mb-8">{product.description}</p>
            )}

            {soldOut ? (
              <button
                onClick={notifyMe}
                className="w-full py-4 rounded-full bg-card border-2 border-gold text-primary text-sm tracking-[0.2em] uppercase hover:bg-secondary transition-all"
              >
                Sold Out — Notify Me
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={addToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase hover:bg-gold-soft transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => { addToCart(); navigate({ to: "/cart" }); }}
                  className="flex-1 py-4 rounded-full bg-gold text-accent-foreground text-sm tracking-[0.2em] uppercase font-medium"
                >
                  Buy Now
                </button>
              </div>
            )}

            <div className="mt-10 space-y-4 text-sm">
              {product.materials && (
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Materials</p>
                  <p className="text-foreground/75">{product.materials}</p>
                </div>
              )}
              {product.care_info && (
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-gold mb-1">Care</p>
                  <p className="text-foreground/75">{product.care_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-16 border-t border-border/50">
          <h2 className="font-serif text-3xl md:text-4xl text-primary text-center mb-10">You may also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {related.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
