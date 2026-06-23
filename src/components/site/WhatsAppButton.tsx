import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919699779276?text=Hi%20ByTech%2C%20I%27d%20like%20to%20discuss%20a%20project."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] hover:scale-105 transition"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
