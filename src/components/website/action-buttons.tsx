import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/site";
import type { VariantProps } from "class-variance-authority";

type ButtonProps = VariantProps<typeof buttonVariants> & { className?: string };

const DEFAULT_WHATSAPP_MESSAGE =
  "Hello Jeevan Dental & Aesthetic Clinic, I would like to enquire about an appointment.";

export function CallButton({
  variant = "outline",
  size,
  className,
  label = "Call Now",
  showIcon = true,
}: ButtonProps & { label?: string; showIcon?: boolean }) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={siteConfig.phone.tel} aria-label={`Call ${siteConfig.name} on ${siteConfig.phone.display}`}>
        {showIcon && <Phone aria-hidden />}
        {label}
      </a>
    </Button>
  );
}

export function WhatsAppButton({
  variant = "whatsapp",
  size,
  className,
  label = "WhatsApp Us",
  message = DEFAULT_WHATSAPP_MESSAGE,
  showIcon = true,
}: ButtonProps & { label?: string; message?: string; showIcon?: boolean }) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Message ${siteConfig.name} on WhatsApp`}
      >
        {showIcon && <MessageCircle aria-hidden />}
        {label}
      </a>
    </Button>
  );
}

export function DirectionsButton({
  variant = "subtle",
  size,
  className,
  label = "Get Directions",
  showIcon = true,
}: ButtonProps & { label?: string; showIcon?: boolean }) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={siteConfig.maps.directions}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get directions to ${siteConfig.name} on Google Maps`}
      >
        {showIcon && <MapPin aria-hidden />}
        {label}
      </a>
    </Button>
  );
}

export function BookAppointmentButton({
  variant = "gold",
  size,
  className,
  label = "Book Appointment",
}: ButtonProps & { label?: string }) {
  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <Link href="/appointment">{label}</Link>
    </Button>
  );
}
