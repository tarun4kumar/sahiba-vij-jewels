import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Sahiba Vij" }] }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(1000),
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setSending(true);
    const text = encodeURIComponent(`Hi! I'm ${parsed.data.name} (${parsed.data.email}).\n\n${parsed.data.message}`);
    window.open(`https://wa.me/${BRAND.whatsappNumber}?text=${text}`, "_blank");
    toast.success("Opening WhatsApp to send your message ✦");
    setSending(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Say Hello</p>
        <h1 className="font-serif text-5xl md:text-6xl text-primary">Let's Talk</h1>
        <div className="gold-divider w-24 mx-auto mt-5" />
        <p className="mt-6 text-foreground/75 max-w-xl mx-auto">For custom orders, styling advice, or just to say hi — we'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <a href={`https://wa.me/${BRAND.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-card p-5 rounded-2xl shadow-soft hover:shadow-gold transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground shadow-gold"><MessageCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold">WhatsApp</p>
              <p className="font-serif text-lg text-primary">Chat with us</p>
            </div>
          </a>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-card p-5 rounded-2xl shadow-soft hover:shadow-gold transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground shadow-gold"><Instagram className="w-5 h-5" /></div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold">Instagram</p>
              <p className="font-serif text-lg text-primary">@sahibavij</p>
            </div>
          </a>
          <a href={`mailto:${BRAND.email}`} className="flex items-center gap-4 bg-card p-5 rounded-2xl shadow-soft hover:shadow-gold transition-all">
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-accent-foreground shadow-gold"><Mail className="w-5 h-5" /></div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gold">Email</p>
              <p className="font-serif text-lg text-primary">{BRAND.email}</p>
            </div>
          </a>
        </div>

        <form onSubmit={submit} className="bg-card rounded-2xl p-6 md:p-8 shadow-soft space-y-4">
          <h2 className="font-serif text-2xl text-primary mb-2">Send a message</h2>
          <input name="name" required maxLength={100} placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-gold" />
          <input name="email" type="email" required maxLength={255} placeholder="Your email" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-gold" />
          <textarea name="message" required maxLength={1000} rows={4} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-gold" />
          <button disabled={sending} className="w-full bg-primary text-primary-foreground py-3.5 rounded-full text-sm tracking-[0.2em] uppercase hover:bg-wine/90 disabled:opacity-50">
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
