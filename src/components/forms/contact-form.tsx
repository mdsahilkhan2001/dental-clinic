"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Check, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitContactAction } from "@/app/actions/contact";

type Values = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  company: string;
};

export function ContactForm() {
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Values>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const consent = watch("consent");

  const onSubmit = handleSubmit(async (data) => {
    setPending(true);
    try {
      const res = await submitContactAction(data);
      if (res.ok) {
        setDone(true);
        toast.success("Message sent. We'll be in touch soon.");
      } else {
        toast.error(res.error ?? "Please review the form.");
        if (res.fieldErrors) {
          for (const [key, message] of Object.entries(res.fieldErrors)) {
            setError(key as keyof Values, { message });
          }
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  });

  if (done) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-background p-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-teal-100 text-accent">
          <Check className="size-6" aria-hidden />
        </span>
        <h3 className="mt-3 text-lg">Message sent</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Thank you for getting in touch. Our team will reply during opening
          hours. For anything urgent, please call the clinic.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--radius-lg)] border border-border bg-background p-6"
    >
      <input
        type="text"
        tabIndex={-1}
        aria-hidden
        autoComplete="off"
        className="hidden"
        {...register("company")}
      />
      <h2 className="text-lg">Send us a message</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We usually reply the same day during opening hours.
      </p>

      <div className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-name">
              Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="c-name"
              autoComplete="name"
              className="mt-1.5"
              aria-invalid={!!errors.name}
              {...register("name", {
                required: "Please enter your name",
                minLength: { value: 2, message: "Please enter your name" },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="c-phone">
              Phone <span className="text-danger">*</span>
            </Label>
            <Input
              id="c-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="mt-1.5"
              aria-invalid={!!errors.phone}
              {...register("phone", {
                required: "Please enter your mobile number",
                pattern: {
                  value: /^(?:\+?91[-\s]?)?[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit Indian mobile number",
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="c-email">Email (optional)</Label>
            <Input
              id="c-email"
              type="email"
              autoComplete="email"
              className="mt-1.5"
              aria-invalid={!!errors.email}
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="c-subject">Subject (optional)</Label>
            <Input id="c-subject" className="mt-1.5" {...register("subject")} />
          </div>
        </div>

        <div>
          <Label htmlFor="c-message">
            Message <span className="text-danger">*</span>
          </Label>
          <Textarea
            id="c-message"
            rows={5}
            className="mt-1.5"
            aria-invalid={!!errors.message}
            {...register("message", {
              required: "Please enter a message",
              minLength: { value: 10, message: "Please add a little more detail" },
            })}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm">
          <Checkbox
            checked={consent}
            onCheckedChange={(checked) =>
              setValue("consent", checked === true, { shouldValidate: true })
            }
          />
          <span className="text-muted-foreground">
            I agree to be contacted about this enquiry.{" "}
            <span className="text-danger">*</span>
          </span>
        </label>
        <input
          type="checkbox"
          className="hidden"
          {...register("consent", { required: "Please agree to be contacted" })}
        />
        {errors.consent && (
          <p className="text-xs text-danger">{errors.consent.message}</p>
        )}

        <Button type="submit" variant="default" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden />
              Send message
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          By sending this message you accept our{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
