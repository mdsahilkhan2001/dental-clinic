"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarPlus, MessageCircle, Phone } from "lucide-react";

import { siteConfig, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Sticky quick-action bar shown on small screens. Hidden on admin routes. */
export function MobileBottomBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-3">
        <a
          href={siteConfig.phone.tel}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-primary"
        >
          <Phone className="size-5 text-accent" aria-hidden />
          Call
        </a>
        <a
          href={whatsappLink(
            "Hello Jeevan Dental & Aesthetic Clinic, I would like to enquire about an appointment.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 border-x border-border py-2.5 text-[11px] font-semibold text-primary"
        >
          <MessageCircle className="size-5 text-[#1FA855]" aria-hidden />
          WhatsApp
        </a>
        <Link
          href="/appointment"
          className={cn(
            "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold",
            pathname === "/appointment"
              ? "bg-gold-100 text-gold-800"
              : "text-primary",
          )}
        >
          <CalendarPlus className="size-5 text-gold-600" aria-hidden />
          Appointment
        </Link>
      </div>
    </div>
  );
}
