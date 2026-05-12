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

export function ProductCard({ p, index }: { p: Product; index?: number }) {
  const soldOut = p.stock_count <= 0;
  const lowStock = !soldOut && p.stock_count < 5;
  const num = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-border transition-all duration-500 group-hover:border-gold/50 group-hover:-translate-y-1">
        <img
          src={p.images[0]}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 brightness-[0.85] group-hover:brightness-100 group-hover:scale-[1.03]"
        />
        {/* Bottom gradient + collection number overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent pointer-events-none" />
        <span className="absolute bottom-3 left-4 font-serif text-[80px] leading-none text-gold/30 select-none pointer-events-none">
          /{num}
        </span>

        {p.is_limited_edition && !soldOut && (
          <span className="absolute top-3 left-3 bg-wine text-foreground text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">
            Limited
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="bg-surface-raised text-muted-foreground font-serif text-sm tracking-[0.4em] uppercase px-5 py-2 border border-border">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="pt-5 px-1">
        <h3 className="font-serif text-xl text-foreground group-hover:text-gold transition-colors leading-tight">
          {p.name}
        </h3>
        <div className="flex items-baseline justify-between mt-1.5">
          <p className={`text-sm tracking-wide ${soldOut ? "text-muted-foreground line-through" : "text-gold"}`}>
            {formatINR(p.price)}
          </p>
          {lowStock && (
            <span className="text-[10px] tracking-[0.2em] uppercase text-rose">Only {p.stock_count} left</span>
          )}
        </div>
      </div>
    </Link>
  );
}
