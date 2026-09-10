/**
 * Single source of truth for clinic identity + NAP (Name, Address, Phone).
 * Keep every reference on the site consistent by importing from here.
 * Runtime-editable values (hours, some content) live in the database and
 * fall back to `src/lib/content/defaults.ts` when the DB is unavailable.
 */

export const siteConfig = {
  name: "Jeevan Dental & Aesthetic Clinic",
  shortName: "Jeevan Clinic",
  tagline: "Complete Dental, Skin, Hair & Aesthetic Care",
  altTagline: "Advanced Care. Personalized Attention. Confident You.",
  description:
    "Jeevan Dental & Aesthetic Clinic in Mahuadanr, Latehar, Jharkhand offers dental, skin, hair and aesthetic care. Book an appointment or contact us on WhatsApp.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://jeevandentalclinic.example",
  locale: "en_IN",

  phone: {
    display: "+91 94307 40698",
    e164: "+919430740698",
    tel: "tel:+919430740698",
  },

  whatsapp: {
    number: "919430740698",
    link: "https://wa.me/919430740698",
  },

  email: "jeevandentalclinic@gmail.com",

  address: {
    line1: "Near Petrol Pump, Main Road",
    line2: "Mahuadanr",
    district: "Latehar",
    region: "Jharkhand",
    postalCode: "822119",
    country: "IN",
    countryName: "India",
    /** Full one-line address for meta / structured data. */
    full:
      "Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119, India",
    /** Short display used in the header / footer. */
    short: "Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119",
  },

  /**
   * Google Maps directions link built from the address string.
   * No latitude/longitude is invented — Maps resolves the query itself.
   */
  maps: {
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(
        "Jeevan Dental & Aesthetic Clinic, Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119",
      ),
    search:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Jeevan Dental & Aesthetic Clinic, Mahuadanr, Latehar, Jharkhand 822119",
      ),
    embed:
      "https://www.google.com/maps?q=" +
      encodeURIComponent(
        "Jeevan Dental & Aesthetic Clinic, Near Petrol Pump, Main Road, Mahuadanr, Latehar, Jharkhand 822119",
      ) +
      "&output=embed",
  },

  serviceAreas: [
    "Mahuadanr",
    "Latehar",
    "Netarhat",
    "Garu",
    "Barwadih",
    "Chhipadohar",
  ],

  keywords: [
    "dental clinic in Mahuadanr",
    "dentist in Mahuadanr",
    "dental clinic in Latehar",
    "skin care clinic in Mahuadanr",
    "hair care clinic in Mahuadanr",
    "aesthetic clinic in Mahuadanr",
    "dental treatment Mahuadanr",
  ],
} as const;

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/doctor" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const serviceCategories = [
  {
    slug: "dental",
    label: "Dental Care",
    href: "/services/dental",
    blurb:
      "Routine check-ups, restorative treatment, root canals, crowns, braces, aligners and smile design.",
  },
  {
    slug: "skin",
    label: "Skin Care",
    href: "/services/skin",
    blurb:
      "Consultation-led care for acne, pigmentation, scars and overall skin health and rejuvenation.",
  },
  {
    slug: "hair",
    label: "Hair Care",
    href: "/services/hair",
    blurb:
      "Evaluation and management for hair fall, scalp concerns and hair restoration treatments.",
  },
  {
    slug: "aesthetic",
    label: "Aesthetic Care",
    href: "/services/aesthetic",
    blurb:
      "Personalized facial aesthetic and cosmetic treatments planned around your goals.",
  },
] as const;

export type ServiceCategorySlug = (typeof serviceCategories)[number]["slug"];

export const MEDICAL_DISCLAIMER =
  "Information provided on this website is for general informational purposes and does not replace professional medical consultation. Treatment suitability and outcomes may vary by individual. Please consult a qualified clinician for personalized advice.";

export const SUITABILITY_DISCLAIMER =
  "Treatment suitability varies from person to person. Please consult our clinician for an appropriate evaluation and treatment plan.";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
