import { createFileRoute, Link } from "@tanstack/react-router";
import { cart, formatINR, useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const items = useCart();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">Your cart is empty</h1>
        <p className="text-foreground/70 mb-8 italic font-serif">Begin your story.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm tracking-wider uppercase hover:bg-wine/90 transition-all shadow-soft">
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20">
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-3">Your Cart</h1>
      <div className="gold-divider w-24 mb-10" />

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 bg-card rounded-2xl p-4 shadow-soft">
              <Link to="/product/$slug" params={{ slug: i.slug }} className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col">
                <Link to="/product/$slug" params={{ slug: i.slug }}>
                  <h3 className="font-serif text-xl text-primary">{i.name}</h3>
                </Link>
                <p className="text-foreground/70 mt-1">{formatINR(i.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => cart.setQty(i.id, i.quantity - 1)} className="p-2 hover:text-gold"><Minus className="w-3 h-3" /></button>
                    <span className="px-3 text-sm">{i.quantity}</span>
                    <button onClick={() => cart.setQty(i.id, i.quantity + 1)} className="p-2 hover:text-gold"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => cart.remove(i.id)} className="text-foreground/60 hover:text-destructive p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-card rounded-2xl p-6 md:p-8 shadow-soft h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl text-primary mb-6">Order Summary</h2>
          <div className="flex justify-between py-2"><span className="text-foreground/70">Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between py-2 text-sm"><span className="text-foreground/70">Shipping</span><span className="italic text-gold">Calculated on confirmation</span></div>
          <div className="gold-divider my-4" />
          <div className="flex justify-between text-lg font-medium mb-6"><span>Total</span><span>{formatINR(subtotal)}</span></div>
          <Link to="/checkout" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-full text-sm tracking-[0.2em] uppercase hover:bg-wine/90 transition-all shadow-soft">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-center text-muted-foreground mt-4 italic">We confirm every order personally on WhatsApp.</p>
        </aside>
      </div>
    </div>
  );
}
