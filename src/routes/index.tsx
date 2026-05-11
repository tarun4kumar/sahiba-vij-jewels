import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type Product } from "@/components/ProductCard";
import { BRAND } from "@/lib/brand";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import founderImg from "@/assets/founder.jpg";
import { useState } from "react";
import { toast } from "sonner";

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
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-blush/0 via-blush/30 to-background" />
        </div>
        <div className="relative container mx-auto px-4 md:px-8 pt-24 md:pt-40 pb-32 md:pb-48 text-center">
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-wine/80 mb-6 font-medium">
            ✦ Heritage Reimagined ✦
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.05] max-w-4xl mx-auto">
            Every Sparkle has<br /><em className="text-gold">Its Own Story</em>
          </h1>
          <p className="mt-6 text-base md:text-lg text-foreground/70 max-w-xl mx-auto">
            Cinematic Indian jewellery in micron gold polish — wearable heirlooms for the modern muse.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm tracking-wider uppercase hover:bg-wine/90 transition-all shadow-soft"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary border-b border-gold pb-1 text-sm tracking-wider uppercase hover:text-gold transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND INTRO */}
      <section className="container mx-auto px-4 md:px-8 py-20 md:py-28 text-center max-w-3xl">
        <Sparkles className="w-6 h-6 text-gold mx-auto mb-6" />
        <h2 className="font-serif text-3xl md:text-5xl text-primary mb-6">
          Story-driven, soul-stirring
        </h2>
        <div className="gold-divider w-24 mx-auto mb-6" />
        <p className="text-foreground/75 text-lg leading-relaxed italic font-serif">
          "Inspired by the courtyards of Bajirao Mastani and the verses of Heeramandi —
          each piece is crafted with micron gold polish, the same finish used in real fine
          jewellery, making wearable luxury accessible."
        </p>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Signature Pieces</p>
            <h2 className="font-serif text-3xl md:text-5xl text-primary">Featured Collection</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm text-primary hover:text-gold border-b border-gold pb-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {(featured ?? []).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        <div className="mt-10 md:hidden text-center">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-primary border-b border-gold pb-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* OUR STORY TEASER */}
      <section className="bg-card mt-24">
        <div className="container mx-auto px-4 md:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-soft">
            <img src={founderImg} alt="Sahiba Vij" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Meet the Designer</p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">A muse with 14 years of craft</h2>
            <div className="gold-divider w-24 mb-6" />
            <p className="text-foreground/75 leading-relaxed mb-4">
              Sahiba Vij blends a Media & Culture Studies background from London with 14 years
              of jewellery design — creating cinematic, story-driven pieces that feel
              luxurious yet remain beautifully accessible.
            </p>
            <p className="text-foreground/75 leading-relaxed mb-8">
              Every piece carries the soul of traditional India and the spirit of a modern woman.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-primary border-b border-gold pb-1 text-sm tracking-wider uppercase">
              Read Her Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MICRON GOLD HIGHLIGHT */}
      <section className="container mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-gold text-accent-foreground px-5 py-2 rounded-full text-xs tracking-[0.25em] uppercase shadow-gold mb-6">
          ✦ Signature Finish
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-primary mb-4">Micron Gold Polish</h2>
        <p className="text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          The same finish used on real fine jewellery — applied generously so every piece
          carries the weight, warmth and luminance of true gold. Wearable luxury that lasts.
        </p>
      </section>

      {/* NEWSLETTER */}
      <NewsletterSection />
    </div>
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
    <section className="container mx-auto px-4 md:px-8 py-16">
      <div className="bg-gradient-blush rounded-3xl p-10 md:p-16 text-center shadow-soft border border-gold/20">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Join the Muse List</p>
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-3">Be the first to know</h2>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">New collections, limited drops, and quiet stories — straight to your inbox.</p>
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3 rounded-full bg-background/80 border border-border focus:outline-none focus:border-gold"
          />
          <button disabled={loading} className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm tracking-wider uppercase hover:bg-wine/90 transition-all disabled:opacity-50">
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
