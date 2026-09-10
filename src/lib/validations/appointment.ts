import { z } from "zod";

import { indianPhoneSchema, optionalEmailSchema } from "./shared";

/** Client form shape (before phone normalisation for display). */
export const appointmentFormSchema = z.object({
  patient_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  phone: indianPhoneSchema,
  email: optionalEmailSchema,
  service_slug: z.string().trim().min(1, "Please choose a service"),
  doctor_slug: z
    .union([z.literal(""), z.string().trim()])
    .optional()
    .transform((v) => (v ? v : null)),
  appointment_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date"),
  appointment_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please choose a time slot"),
  message: z
    .string()
    .trim()
    .max(1000, "Message is too long")
    .optional()
    .transform((v) => (v ? v : null)),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please agree to be contacted about this appointment",
    }),
  }),
  /** Honeypot — must stay empty. */
  company: z.string().max(0).optional(),
});

export type AppointmentFormValues = z.input<typeof appointmentFormSchema>;
export type AppointmentFormParsed = z.output<typeof appointmentFormSchema>;

export const appointmentStatusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ]),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  doctor_slug: z.string().optional(),
});
