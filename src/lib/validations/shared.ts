import { z } from "zod";

/** Normalise an Indian mobile number to `+91XXXXXXXXXX`. */
export function normalizeIndianPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  const local = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith("0") && digits.length === 11
      ? digits.slice(1)
      : digits;
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return `+91${local}`;
}

export const indianPhoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .transform((value, ctx) => {
    const normalized = normalizeIndianPhone(value);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid 10-digit Indian mobile number",
      });
      return z.NEVER;
    }
    return normalized;
  });

export const optionalEmailSchema = z
  .union([z.literal(""), z.string().trim().email("Enter a valid email address")])
  .optional()
  .transform((value) => (value ? value : null));

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only",
  );

export const serviceCategorySchema = z.enum([
  "dental",
  "skin",
  "hair",
  "aesthetic",
]);

export const galleryCategorySchema = z.enum([
  "clinic",
  "dental",
  "skin",
  "hair",
  "aesthetic",
  "team",
  "results",
]);

export const faqCategorySchema = z.enum([
  "dental",
  "skin",
  "hair",
  "aesthetic",
  "appointments",
  "general",
]);

export const appointmentStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);
