import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ArrowDown, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-dark.jpg";
import founderImg from "@/assets/founder-dark.jpg";
import { useState } from "react";
import { toast } from "sonner";
import { formatINR } from "@/lib/cart";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: featured } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(6);
      return (data ?? []) as Product[];
    },
  });

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 dark-overlay" />

        {/* Top-right editorial detail */}
        <div className="absolute top-6 right-5 md:top-10 md:right-12 text-right hero-rise hero-rise-1">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-1">Collection</p>
          <p className="font-serif text-2xl text-foreground/80">/01</p>
        </div>

        {/* Bottom-left text */}
        <div className="absolute bottom-12 md:bottom-20 left-5 md:left-12 max-w-3xl">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-6 hero-rise hero-rise-1">
            ✦ Heritage Reimagined
          </p>
          <h1
            className="font-serif text-foreground leading-[0.95] mb-6"
            style={{ fontSize: "clamp(3rem, 11vw, 8rem)", letterSpacing: "-0.02em" }}
          >
            <span className="block hero-rise hero-rise-2">Every Sparkle</span>
            <span className="block hero-rise hero-rise-3">has Its</span>
            <span className="block italic text-gold hero-rise hero-rise-4">Own Story</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base tracking-wide mb-8 max-w-md hero-rise hero-rise-4">
            Cinematic Indian jewellery in micron gold polish — wearable heirlooms for the modern muse.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 text-gold text-[11px] tracking-[0.4em] uppercase border-b border-gold pb-2 hover:gap-4 transition-all hero-rise hero-rise-4"
          >
            <ArrowDown className="w-3 h-3" /> Explore Collection
          </Link>
        </div>
      </section>

      {/* BRAND INTRO */}
      <section className="bg-surface relative overflow-hidden">
        <div className="absolute inset-0 floral-watermark" />
        <Reveal className="relative container mx-auto px-5 md:px-10 py-24 md:py-32 text-center max-w-3xl">
          <p className="font-serif italic text-2xl md:text-4xl leading-[1.4] text-foreground">
            Inspired by the courtyards of Bajirao Mastani and the verses of Heeramandi —
            crafted in micron gold polish. Wearable heritage for the modern muse.
          </p>
          <div className="gold-rule-solid w-20 mx-auto mt-10 mb-10" />
          <div className="flex flex-wrap justify-center gap-3">
            {["14 Years · Crafted", "Micron Gold", "Story-Driven"].map((t) => (
              <span key={t} className="text-[10px] tracking-[0.4em] uppercase text-gold border border-gold/40 px-4 py-2">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FEATURED — Bento */}
      <section className="container mx-auto px-5 md:px-10 py-20 md:py-28">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-3">/ Signature Pieces</p>
              <h2 className="font-serif text-4xl md:text-6xl text-foreground">Featured Collection</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-gold border-b border-gold/40 pb-1.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Reveal>

        <FeaturedBento products={featured ?? []} />

        <div className="mt-12 md:hidden text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold border-b border-gold pb-1.5">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* DESIGNER */}
      <section className="bg-surface">
        <div className="grid md:grid-cols-2 items-stretch">
          <Reveal className="relative aspect-[4/5] md:aspect-auto md:min-h-[640px] overflow-hidden">
            <img src={founderImg} alt="Sahiba Vij" loading="lazy" className="w-full h-full object-cover brightness-90" />
          </Reveal>
          <Reveal className="bg-background flex items-center" delay={150}>
            <div className="px-8 md:px-16 py-16 md:py-20 max-w-xl">
              <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-5">Meet the Designer</p>
              <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-[1.05] mb-6">
                A muse with <em className="text-gold">14 years</em> of craft
              </h2>
              <div className="gold-rule-solid w-16 mb-8" />
              <p className="text-muted-foreground leading-[1.8] mb-4">
                Sahiba Vij blends a Media & Culture Studies background from London with 14 years
                of jewellery design — creating cinematic, story-driven pieces that feel
                luxurious yet remain beautifully accessible.
              </p>
              <p className="text-muted-foreground leading-[1.8] mb-10">
                Every piece carries the soul of traditional India and the spirit of a modern woman.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-gold text-[11px] tracking-[0.4em] uppercase hover:gap-3 transition-all">
                Read Her Story <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MICRON GOLD */}
      <section className="relative bg-wine-grad overflow-hidden">
        <div className="absolute inset-0 floral-watermark opacity-50" />
        <Reveal className="relative container mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-6">✦ Signature Finish ✦</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-8 leading-tight">
            Micron <em className="text-gold">Gold</em> Polish
          </h2>
          <div className="gold-rule-solid w-20 mx-auto mb-8" />
          <p className="text-muted-foreground max-w-xl mx-auto leading-[1.9]">
            The same finish used on real fine jewellery — applied generously so every piece
            carries the weight, warmth and luminance of true gold. Wearable luxury that lasts.
          </p>
        </Reveal>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}

function FeaturedBento({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [hero, ...rest] = products;
  const small = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Large hero card */}
      <Reveal className="md:col-span-2 md:row-span-2">
        <BentoCard p={hero} num="01" tall />
      </Reveal>

      {small.map((p, i) => (
        <Reveal key={p.id} delay={i * 80} className="md:col-span-1">
          <BentoCard p={p} num={String(i + 2).padStart(2, "0")} />
        </Reveal>
      ))}
    </div>
  );
}

function BentoCard({ p, num, tall }: { p: Product; num: string; tall?: boolean }) {
  const soldOut = p.stock_count <= 0;
  return (
    <Link
      to="/product/$slug"
      params={{ slug: p.slug }}
      className={`group relative block overflow-hidden bg-surface border border-border transition-all duration-500 hover:border-gold/50 ${tall ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[640px]" : "aspect-[4/5]"}`}
    >
      <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover brightness-[0.85] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      {p.is_limited_edition && !soldOut && (
        <span className="absolute top-4 left-4 bg-wine text-foreground text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">Limited</span>
      )}
      {soldOut && (
        <span className="absolute top-4 right-4 bg-surface-raised text-muted-foreground text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border border-border">Sold Out</span>
      )}
      <span className={`absolute bottom-4 left-5 font-serif leading-none text-gold/30 select-none ${tall ? "text-[140px]" : "text-[90px]"}`}>
        /{num}
      </span>
      <div className="absolute bottom-5 right-5 text-right">
        <p className={`font-serif text-foreground ${tall ? "text-2xl md:text-3xl" : "text-xl"}`}>{p.name}</p>
        <p className="text-[11px] tracking-[0.25em] uppercase text-gold mt-1">{formatINR(p.price)}</p>
      </div>
    </Link>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Enter a valid email");
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Couldn't subscribe. Try again.");
    } else {
      toast.success("Welcome to the muse list ✦");
      setEmail("");
    }
  };

  return (
    <section className="container mx-auto px-5 md:px-10 py-20">
      <Reveal>
        <div className="bg-surface border border-gold/30 rounded-md p-10 md:p-16 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-gold mb-4">Join the Muse List</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Be the first to know</h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">New collections, limited drops, and quiet stories — straight to your inbox.</p>
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-sm bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
            />
            <button disabled={loading} className="px-7 py-3.5 rounded-sm bg-gold text-accent-foreground text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-gold-soft transition-all disabled:opacity-50">
              {loading ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
