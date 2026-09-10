import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import {
  BookAppointmentButton,
  CallButton,
  DirectionsButton,
  WhatsAppButton,
} from "@/components/website/action-buttons";
import { cn } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/site";

export function ContactCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-background p-6",
        className,
      )}
    >
      <h3 className="text-lg">{siteConfig.name}</h3>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li className="flex gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
          <span>
            {siteConfig.address.line1},<br />
            {siteConfig.address.line2}, {siteConfig.address.district},<br />
            {siteConfig.address.region} – {siteConfig.address.postalCode},{" "}
            {siteConfig.address.countryName}
          </span>
        </li>
        <li className="flex gap-3">
          <Phone className="size-4 shrink-0 text-accent" aria-hidden />
          <a href={siteConfig.phone.tel} className="hover:text-primary">
            {siteConfig.phone.display}
          </a>
        </li>
        <li className="flex gap-3">
          <MessageCircle className="size-4 shrink-0 text-accent" aria-hidden />
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            WhatsApp {siteConfig.phone.display}
          </a>
        </li>
        <li className="flex gap-3">
          <Mail className="size-4 shrink-0 text-accent" aria-hidden />
          <a
            href={`mailto:${siteConfig.email}`}
            className="hover:text-primary"
          >
            {siteConfig.email}
          </a>
        </li>
      </ul>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <CallButton size="sm" />
        <WhatsAppButton size="sm" />
        <DirectionsButton size="sm" />
        <BookAppointmentButton size="sm" />
      </div>
    </div>
  );
}
