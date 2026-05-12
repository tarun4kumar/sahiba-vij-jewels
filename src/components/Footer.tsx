import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-24 bg-deepest border-t border-border">
      <div className="container mx-auto px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <h3 className="font-serif text-3xl text-foreground mb-3">{BRAND.name}</h3>
          <p className="font-serif italic text-gold mb-6 text-lg">{BRAND.tagline}</p>
          <div className="flex gap-3">
            {[
              { href: BRAND.instagram, icon: Instagram },
              { href: `https://wa.me/${BRAND.whatsappNumber}`, icon: MessageCircle },
              { href: `mailto:${BRAND.email}`, icon: Mail },
            ].map(({ href, icon: Icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-accent-foreground transition-all">
                <Icon className="w-4 h-4" strokeWidth={1.4} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.4em] uppercase mb-5 text-gold">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-gold transition-colors">Shop All</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
            <li><Link to="/track" className="hover:text-gold transition-colors">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.4em] uppercase mb-5 text-gold">Care</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>Shipping across India</li>
            <li>7-day exchange</li>
            <li>COD · UPI · Bank Transfer</li>
            <li>WhatsApp support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto px-5 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between text-[10px] tracking-[0.3em] uppercase text-muted-foreground gap-2">
          <p>© {new Date().getFullYear()} {BRAND.name}</p>
          <p className="text-gold">Crafted with love in India ♦</p>
        </div>
      </div>
    </footer>
  );
}
