import Link from "next/link";
import { CalendarPlus, MapPin, MessageCircle, Phone } from "lucide-react";

import { siteConfig, whatsappLink } from "@/lib/site";

const actions = [
  {
    label: "Call Now",
    value: siteConfig.phone.display,
    href: siteConfig.phone.tel,
    Icon: Phone,
    external: false,
    accent: "text-accent bg-teal-50",
  },
  {
    label: "WhatsApp",
    value: siteConfig.phone.display,
    href: whatsappLink(
      "Hello Jeevan Dental & Aesthetic Clinic, I would like to book an appointment.",
    ),
    Icon: MessageCircle,
    external: true,
    accent: "text-[#1FA855] bg-[#1FA855]/10",
  },
  {
    label: "Book Appointment",
    value: "Online in a minute",
    href: "/appointment",
    Icon: CalendarPlus,
    external: false,
    accent: "text-gold-700 bg-gold-100",
  },
  {
    label: "Get Directions",
    value: `${siteConfig.address.line2}, ${siteConfig.address.region}`,
    href: siteConfig.maps.directions,
    Icon: MapPin,
    external: true,
    accent: "text-navy-700 bg-navy-100",
  },
];

export function QuickActionBar() {
  return (
    <section
      aria-label="Quick contact"
      className="container-page relative z-10 -mt-7 pb-2 md:-mt-9"
    >
      <div className="grid gap-3 rounded-[var(--radius-xl)] border border-border bg-background p-3 shadow-[var(--shadow-elevated)] sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ label, value, href, Icon, external, accent }) => {
          const inner = (
            <>
              <span
                className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full ${accent}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-primary">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">{value}</span>
              </span>
            </>
          );
          const cls =
            "flex items-center gap-3 rounded-[var(--radius-lg)] p-3 transition-colors hover:bg-surface";
          return external ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {inner}
            </a>
          ) : (
            <Link key={label} href={href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
