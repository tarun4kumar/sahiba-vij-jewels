import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

const KEY = "sv_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("sv_cart_change"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener("sv_cart_change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sv_cart_change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return items;
}

export const cart = {
  get: read,
  add(item: Omit<CartItem, "quantity">, qty = 1) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) existing.quantity += qty;
    else items.push({ ...item, quantity: qty });
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
      .filter((i) => i.quantity > 0);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
  total() {
    return read().reduce((s, i) => s + i.price * i.quantity, 0);
  },
};

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
