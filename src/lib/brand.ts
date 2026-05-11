export const BRAND = {
  name: "Sahiba Vij",
  tagline: "Every Sparkle has Its Own Story",
  whatsappNumber: "919999999999", // placeholder — owner can update
  instagram: "https://instagram.com/sahibavij",
  email: "hello@sahibavij.com",
};

export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "necklaces", label: "Necklaces" },
  { value: "earrings", label: "Earrings" },
  { value: "rings", label: "Rings" },
  { value: "bangles", label: "Bangles" },
  { value: "sets", label: "Sets" },
];

export function generateOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `SV-${ymd}-${rand}`;
}
