import { z } from "zod";

import { indianPhoneSchema, optionalEmailSchema } from "./shared";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: indianPhoneSchema,
  email: optionalEmailSchema,
  subject: z.string().trim().max(150).optional().transform((v) => v || null),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail")
    .max(1500, "Message is too long"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please agree to be contacted" }),
  }),
  company: z.string().max(0).optional(),
});

export type ContactFormValues = z.input<typeof contactFormSchema>;
