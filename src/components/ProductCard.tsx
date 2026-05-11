import { Link } from "@tanstack/react-router";
import { formatINR } from "@/lib/cart";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
  stock_count: number;
  is_featured: boolean;
  is_limited_edition: boolean;
};

export function ProductCard({ p }: { p: Product }) {
  const soldOut = p.stock_count <= 0;
  const lowStock = !soldOut && p.stock_count < 5;

  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-card shadow-soft">
        <img
          src={p.images[0]}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {p.is_limited_edition && !soldOut && (
          <span className="absolute top-3 left-3 bg-gradient-gold text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full text-accent-foreground font-medium shadow-gold">
            Limited
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 backdrop-blur-[2px]">
            <span className="bg-gradient-gold text-accent-foreground font-serif text-lg tracking-[0.3em] uppercase px-6 py-2 rounded-full shadow-gold">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="pt-4 px-1">
        <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">
          {p.name}
        </h3>
        <div className="flex items-baseline justify-between mt-1">
          <p className="text-foreground/80">{formatINR(p.price)}</p>
          {lowStock && (
            <span className="text-xs italic text-gold">Only {p.stock_count} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
