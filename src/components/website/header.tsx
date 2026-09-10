"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  primaryNav,
  serviceCategories,
  siteConfig,
  whatsappLink,
} from "@/lib/site";

const WA_MESSAGE =
  "Hello Jeevan Dental & Aesthetic Clinic, I would like to enquire about an appointment.";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenus = () => {
    setMobileOpen(false);
    setServicesOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/92 backdrop-blur-md shadow-[0_1px_0_rgba(15,37,68,0.06)]"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          onClick={closeMenus}
          className="flex items-center gap-2.5"
          aria-label={`${siteConfig.name} — home`}
        >
          <Image
            src="/images/logo.jpg"
            alt=""
            width={48}
            height={48}
            className="size-10 rounded-full object-cover md:size-11"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-[15px] font-semibold text-primary md:text-base">
              Jeevan
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Dental &amp; Aesthetic Clinic
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) =>
            item.label === "Services" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  onClick={closeMenus}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-accent"
                      : "text-primary hover:text-accent",
                  )}
                  aria-expanded={servicesOpen}
                >
                  {item.label}
                  <ChevronDown className="size-3.5" aria-hidden />
                </Link>
                {servicesOpen && (
                  <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-2">
                    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background p-1.5 shadow-[var(--shadow-elevated)]">
                      {serviceCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={cat.href}
                          onClick={closeMenus}
                          className="block rounded-md px-3 py-2.5 text-sm text-primary transition-colors hover:bg-surface"
                        >
                          <span className="font-semibold">{cat.label}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {cat.blurb.split(",")[0]}
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={closeMenus}
                        className="mt-1 block rounded-md bg-surface px-3 py-2 text-xs font-semibold text-accent"
                      >
                        View all services →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-accent"
                    : "text-primary hover:text-accent",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.phone.tel}
            className="hidden size-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:border-accent hover:text-accent sm:inline-flex"
            aria-label={`Call ${siteConfig.phone.display}`}
          >
            <Phone className="size-4" aria-hidden />
          </a>
          <a
            href={whatsappLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden size-10 items-center justify-center rounded-full border border-border text-[#1FA855] transition-colors hover:border-[#1FA855] sm:inline-flex"
            aria-label="Message us on WhatsApp"
          >
            <MessageCircle className="size-4" aria-hidden />
          </a>
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link href="/appointment" onClick={closeMenus}>
              Book Appointment
            </Link>
          </Button>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-primary lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="container-page border-t border-border bg-background pb-6 pt-2">
            <nav className="flex flex-col" aria-label="Mobile">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={cn(
                    "border-b border-border/70 py-3.5 text-[15px] font-medium",
                    isActive(item.href) ? "text-accent" : "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Button asChild variant="outline" size="sm">
                <a href={siteConfig.phone.tel}>
                  <Phone aria-hidden /> Call
                </a>
              </Button>
              <Button asChild variant="whatsapp" size="sm">
                <a
                  href={whatsappLink(WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="gold" size="sm" className="col-span-2">
                <Link href="/appointment" onClick={closeMenus}>
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
