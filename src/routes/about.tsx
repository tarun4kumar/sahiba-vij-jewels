import { createFileRoute } from "@tanstack/react-router";
import founderImg from "@/assets/founder.jpg";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Sahiba Vij" },
      { name: "description", content: "The story of Sahiba Vij — story-driven luxury Indian jewellery in micron gold polish." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24 text-center max-w-3xl">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Our Story</p>
        <h1 className="font-serif text-5xl md:text-7xl text-primary leading-tight">A muse, a memory, a maker</h1>
        <div className="gold-divider w-32 mx-auto mt-8" />
      </section>

      <section className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-center pb-20">
        <div className="aspect-[4/5] rounded-md overflow-hidden">
          <img src={founderImg} alt="Sahiba Vij" loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">The Designer</p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6">Sahiba Vij</h2>
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              Sahiba Vij is a jewellery designer with a Media and Culture Studies background from London,
              inspired by cinematic jewellery from <em>Bajirao Mastani</em> and <em>Heeramandi</em>.
            </p>
            <p>
              With 14 years of experience, she creates story-driven pieces that are luxurious yet affordable.
              Every piece uses <strong className="text-foreground">micron gold polish</strong> — the same finish
              used in real fine jewellery — making wearable luxury accessible.
            </p>
            <p>
              The brand makes signature statement pieces — traditional Indian design with a modern twist.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="container mx-auto px-4 md:px-8 py-20 md:py-28 text-center max-w-3xl">
          <Sparkles className="w-7 h-7 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">The Craftsmanship</h2>
          <div className="gold-divider w-24 mx-auto mb-8" />
          <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-foreground/80">
            "Micron gold polish is the same finish artisans apply to real fine jewellery —
            a generous, lasting layer that brings the warmth and luminance of true gold to
            every piece. It is luxury, made wearable."
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-3 gap-10 text-center">
        {[
          { t: "Cinematic", d: "Inspired by the courtyards of Bajirao Mastani and the verses of Heeramandi." },
          { t: "Story-Driven", d: "Every piece carries a story — italics whispered, not shouted." },
          { t: "Accessible Luxury", d: "Micron gold polish — fine jewellery feel, without the fine jewellery cost." },
        ].map((b) => (
          <div key={b.t}>
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">✦</p>
            <h3 className="font-serif text-2xl text-foreground mb-3">{b.t}</h3>
            <p className="text-foreground/75 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
