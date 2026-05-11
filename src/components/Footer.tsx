import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <h3 className="font-serif text-3xl mb-2">{BRAND.name}</h3>
          <p className="italic text-primary-foreground/70 mb-5">{BRAND.tagline}</p>
          <div className="flex gap-3">
            <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={`https://wa.me/${BRAND.whatsappNumber}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href={`mailto:${BRAND.email}`} className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.25em] uppercase mb-4 text-accent">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.25em] uppercase mb-4 text-accent">Care</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>Shipping across India</li>
            <li>7-day exchange policy</li>
            <li>Cash on Delivery available</li>
            <li>WhatsApp support</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Crafted with love in India ✦</p>
        </div>
      </div>
    </footer>
  );
}
