import Link from "next/link";
import { ArrowUpRight, CalendarPlus, MapPin, MessageCircle, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/site";

const methods = [
  {
    label: "Call the clinic",
    value: siteConfig.phone.display,
    hint: "Mon–Sun, clinic hours",
    href: siteConfig.phone.tel,
    external: false,
    Icon: Phone,
    tone: "bg-teal-50 text-accent",
  },
  {
    label: "Chat on WhatsApp",
    value: siteConfig.phone.display,
    hint: "Fastest way to reach us",
    href: whatsappLink(
      "Hello Jeevan Dental & Aesthetic Clinic, I have a question.",
    ),
    external: true,
    Icon: MessageCircle,
    tone: "bg-[#1FA855]/10 text-[#1FA855]",
  },
  {
    label: "Get directions",
    value: `${siteConfig.address.line2}, ${siteConfig.address.region}`,
    hint: "Opens Google Maps",
    href: siteConfig.maps.directions,
    external: true,
    Icon: MapPin,
    tone: "bg-navy-100 text-navy-700",
  },
  {
    label: "Book an appointment",
    value: "Online in a minute",
    hint: "Choose a time that suits you",
    href: "/appointment",
    external: false,
    Icon: CalendarPlus,
    tone: "bg-gold-100 text-gold-700",
  },
];

export function ContactMethods() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {methods.map(({ label, value, hint, href, external, Icon, tone }) => {
        const body = (
          <>
            <span
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-full",
                tone,
              )}
            >
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
              {label}
              <ArrowUpRight
                className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden
              />
            </span>
            <span className="mt-1 block text-sm text-foreground">{value}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {hint}
            </span>
          </>
        );
        const cls =
          "group flex flex-col rounded-[var(--radius-lg)] border border-border bg-background p-5 transition-all hover:-translate-y-1 hover:border-navy-200 hover:shadow-[var(--shadow-card)]";
        return external ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
          >
            {body}
          </a>
        ) : (
          <Link key={label} href={href} className={cls}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
