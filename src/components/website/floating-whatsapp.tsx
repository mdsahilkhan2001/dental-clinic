"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/lib/site";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink(
        "Hello Jeevan Dental & Aesthetic Clinic, I would like to enquire about an appointment.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 inline-flex size-13 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-[var(--shadow-elevated)] transition-transform hover:scale-105 lg:bottom-6 lg:right-6 lg:size-14"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
