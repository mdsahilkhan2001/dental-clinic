import Image from "next/image";
import Link from "next/link";
import { Lock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getClinicHours, getSiteContent } from "@/lib/data";
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/website/social-icons";
import { primaryNav, serviceCategories, siteConfig, whatsappLink } from "@/lib/site";

export async function Footer() {
  const [content, hours] = await Promise.all([
    getSiteContent(),
    getClinicHours(),
  ]);

  const socials = [
    { href: content.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: content.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: content.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    {
      href: content.social.googleBusiness,
      label: "Google Business Profile",
      Icon: GoogleIcon,
    },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-auto border-t border-border bg-navy-900 text-navy-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt=""
              width={48}
              height={48}
              className="size-11 rounded-full object-cover"
            />
            <span className="font-serif text-lg text-white">
              Jeevan Dental &amp; Aesthetic Clinic
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
            {content.footerNote}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2.5">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-navy-700 text-navy-100 transition-colors hover:border-gold-300 hover:text-gold-200"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Footer — pages">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-300">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-navy-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — services">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-300">
            Services
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {serviceCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={cat.href}
                  className="text-navy-200 transition-colors hover:text-white"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/appointment"
                className="font-semibold text-gold-200 transition-colors hover:text-gold-100"
              >
                Book Appointment
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-300">
            Visit us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-navy-200">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-300" aria-hidden />
              <span>
                {siteConfig.address.line1},<br />
                {siteConfig.address.line2}, {siteConfig.address.district},<br />
                {siteConfig.address.region} {siteConfig.address.postalCode}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="size-4 shrink-0 text-gold-300" aria-hidden />
              <a href={siteConfig.phone.tel} className="hover:text-white">
                {siteConfig.phone.display}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MessageCircle className="size-4 shrink-0 text-gold-300" aria-hidden />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp {siteConfig.phone.display}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="size-4 shrink-0 text-gold-300" aria-hidden />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
          </ul>

          <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-navy-300">
            Opening hours
          </h3>
          <ul className="mt-3 space-y-1 text-[13px] text-navy-200">
            {hours.map((day) => (
              <li key={day.day_of_week} className="flex justify-between gap-4">
                <span>{day.label}</span>
                <span className="text-navy-100">{day.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 px-3 py-1.5 font-semibold text-navy-100 transition-colors hover:border-gold-300 hover:text-white"
            >
              <Lock className="size-3" aria-hidden />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
