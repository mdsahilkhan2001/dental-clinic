import { z } from "zod";

import {
  faqCategorySchema,
  galleryCategorySchema,
  serviceCategorySchema,
  slugSchema,
} from "./shared";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

const lineList = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  );

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2, "Title is required").max(120),
  slug: slugSchema,
  category: serviceCategorySchema,
  short_description: z
    .string()
    .trim()
    .min(10, "Add a short description")
    .max(300),
  description: z.string().trim().max(6000).optional().transform((v) => v || null),
  suitable_for: lineList,
  procedure_steps: lineList,
  benefits: lineList,
  faqs: z
    .array(
      z.object({
        question: z.string().trim().min(3),
        answer: z.string().trim().min(3),
      }),
    )
    .default([]),
  image_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
  meta_title: z.string().trim().max(160).optional().transform((v) => v || null),
  meta_description: z
    .string()
    .trim()
    .max(320)
    .optional()
    .transform((v) => v || null),
});
export type ServiceValues = z.input<typeof serviceSchema>;

export const doctorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: slugSchema,
  title: z.string().trim().max(160).optional().transform((v) => v || null),
  qualification: z
    .string()
    .trim()
    .max(240)
    .optional()
    .transform((v) => v || null),
  specialization: z
    .string()
    .trim()
    .max(240)
    .optional()
    .transform((v) => v || null),
  experience: z.string().trim().max(120).optional().transform((v) => v || null),
  bio: z.string().trim().max(4000).optional().transform((v) => v || null),
  image_url: z.string().trim().optional().transform((v) => v || null),
  languages: lineList,
  services: lineList,
  published: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});
export type DoctorValues = z.input<typeof doctorSchema>;

export const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  image_url: z.string().trim().min(1, "An image is required"),
  storage_path: z.string().trim().optional().transform((v) => v || null),
  title: z.string().trim().max(160).optional().transform((v) => v || null),
  category: galleryCategorySchema,
  alt_text: z.string().trim().min(3, "Alt text is required for accessibility").max(300),
  display_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});
export type GalleryValues = z.input<typeof gallerySchema>;

export const dentalSpecialtySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().max(160).optional().transform((v) => v || null),
  image_url: z.string().trim().optional().transform((v) => v || null),
  href: z.string().trim().max(200).optional().transform((v) => v || null),
  display_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const beforeAfterSchema = z.object({
  id: z.string().uuid().optional(),
  treatment: z.string().trim().min(2, "Treatment name is required").max(160),
  description: z.string().trim().max(1000).optional().transform((v) => v || null),
  before_url: z.string().trim().min(1, "Before image is required"),
  after_url: z.string().trim().min(1, "After image is required"),
  consent_obtained: z.boolean().default(false),
  published: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  patient_name: z.string().trim().min(2, "Name is required").max(120),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  review: z.string().trim().min(10, "Review is required").max(1500),
  service: z.string().trim().max(160).optional().transform((v) => v || null),
  photo_url: z.string().trim().optional().transform((v) => v || null),
  display_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .transform((v) => v || null),
  published: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(5, "Question is required").max(300),
  answer: z.string().trim().min(5, "Answer is required").max(3000),
  category: faqCategorySchema,
  featured: z.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

const timeString = z
  .string()
  .regex(/^\d{2}:\d{2}$/)
  .nullable()
  .or(z.literal("").transform(() => null));

export const clinicHoursSchema = z.object({
  days: z
    .array(
      z.object({
        day_of_week: z.coerce.number().int().min(0).max(6),
        is_open: z.boolean(),
        morning_start: timeString,
        morning_end: timeString,
        evening_start: timeString,
        evening_end: timeString,
      }),
    )
    .length(7),
});

export const siteContentSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().max(120),
    headline: z.string().trim().min(4).max(160),
    subheadline: z.string().trim().min(10).max(400),
    primaryCtaLabel: z.string().trim().min(2).max(40),
    secondaryCtaLabel: z.string().trim().min(2).max(40),
  }),
  about: z.object({
    heading: z.string().trim().min(4).max(200),
    body: z
      .string()
      .transform((v) =>
        v
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      ),
  }),
  whyChooseUs: z.array(
    z.object({
      title: z.string().trim().min(2).max(120),
      description: z.string().trim().min(10).max(400),
    }),
  ),
  cta: z.object({
    heading: z.string().trim().min(4).max(160),
    body: z.string().trim().min(10).max(400),
  }),
  footerNote: z.string().trim().min(10).max(600),
  social: z.object({
    instagram: z.string().trim().url().or(z.literal("")),
    facebook: z.string().trim().url().or(z.literal("")),
    youtube: z.string().trim().url().or(z.literal("")),
    googleBusiness: z.string().trim().url().or(z.literal("")),
  }),
});

export const blogPostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(4, "Title is required").max(180),
  slug: slugSchema,
  cover_image_url: z.string().trim().optional().transform((v) => v || null),
  excerpt: z.string().trim().max(400).optional().transform((v) => v || null),
  content: z.string().trim().min(20, "Content is required"),
  author: z.string().trim().max(120).optional().transform((v) => v || null),
  category: z.string().trim().max(80).optional().transform((v) => v || null),
  seo_title: z.string().trim().max(160).optional().transform((v) => v || null),
  seo_description: z
    .string()
    .trim()
    .max(320)
    .optional()
    .transform((v) => v || null),
  status: z.enum(["draft", "published"]).default("draft"),
});
