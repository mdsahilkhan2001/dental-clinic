"use client";

import * as React from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Loader2,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

import "react-day-picker/style.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatDate, formatTime, toDateInputValue } from "@/lib/utils";
import { siteConfig, whatsappLink } from "@/lib/site";
import {
  createAppointmentAction,
  type AppointmentActionResult,
} from "@/app/actions/appointments";
import { BOOKING_WINDOW_DAYS } from "@/lib/appointments.constants";
import type { DoctorRow, ServiceRow } from "@/types/database";

type Values = {
  patient_name: string;
  phone: string;
  email: string;
  service_slug: string;
  doctor_slug: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
  consent: boolean;
  company: string;
};

interface AvailabilitySlot {
  time: string;
  available: boolean;
}

const CATEGORY_LABEL: Record<ServiceRow["category"], string> = {
  dental: "Dental Care",
  skin: "Skin Care",
  hair: "Hair Care",
  aesthetic: "Aesthetic Care",
};

const STEPS = ["Service", "Doctor", "Date", "Time", "Your details"] as const;

export function AppointmentForm({
  services,
  doctors,
  initialServiceSlug,
  initialDoctorSlug,
}: {
  services: ServiceRow[];
  doctors: DoctorRow[];
  initialServiceSlug?: string;
  initialDoctorSlug?: string;
}) {
  const [step, setStep] = React.useState(0);
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<AppointmentActionResult | null>(
    null,
  );
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);
  const [slotMessage, setSlotMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    setError,
    formState: { errors },
  } = useForm<Values>({
    mode: "onTouched",
    defaultValues: {
      patient_name: "",
      phone: "",
      email: "",
      service_slug:
        initialServiceSlug &&
        services.some((s) => s.slug === initialServiceSlug)
          ? initialServiceSlug
          : "",
      doctor_slug:
        initialDoctorSlug && doctors.some((d) => d.slug === initialDoctorSlug)
          ? initialDoctorSlug
          : "",
      appointment_date: "",
      appointment_time: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const values = watch();
  const selectedService = services.find(
    (s) => s.slug === values.service_slug,
  );
  const selectedDoctor = doctors.find((d) => d.slug === values.doctor_slug);

  const grouped = React.useMemo(() => {
    const map = new Map<ServiceRow["category"], ServiceRow[]>();
    for (const s of services) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return [...map.entries()];
  }, [services]);

  // Load availability whenever the chosen date changes.
  React.useEffect(() => {
    const date = values.appointment_date;
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSlotMessage(null);
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setSlots([]);
          setSlotMessage(data.error);
          return;
        }
        setSlots(data.slots ?? []);
        setSlotMessage(data.message ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setSlotMessage("Could not load times. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [values.appointment_date]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);

  async function goNext() {
    const fieldByStep: (keyof Values)[][] = [
      ["service_slug"],
      [],
      ["appointment_date"],
      ["appointment_time"],
      [],
    ];
    const fields = fieldByStep[step];
    if (step === 0 && !values.service_slug) {
      toast.error("Please choose a service to continue.");
      return;
    }
    if (step === 2 && !values.appointment_date) {
      toast.error("Please choose a date.");
      return;
    }
    if (step === 3 && !values.appointment_time) {
      toast.error("Please choose a time slot.");
      return;
    }
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = handleSubmit(async (data) => {
    setPending(true);
    setResult(null);
    try {
      const res = await createAppointmentAction({
        patient_name: data.patient_name,
        phone: data.phone,
        email: data.email,
        service_slug: data.service_slug,
        doctor_slug: data.doctor_slug || "",
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        message: data.message,
        consent: data.consent,
        company: data.company,
      });
      setResult(res);
      if (res.ok) {
        toast.success("Appointment request received");
      } else {
        toast.error(res.error ?? "Please review the form and try again.");
        if (res.fieldErrors) {
          for (const [key, message] of Object.entries(res.fieldErrors)) {
            setError(key as keyof Values, { message });
          }
          if (res.fieldErrors.appointment_time) setStep(3);
          else if (res.fieldErrors.service_slug) setStep(0);
        }
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  });

  if (result?.ok && result.appointment) {
    return <Confirmation appointment={result.appointment} persisted={result.persisted} />;
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-xl)] border border-border bg-background">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...register("company")}
      />

      {/* Stepper */}
      <ol className="flex flex-wrap gap-x-2 gap-y-1 border-b border-border px-5 py-4 text-xs font-semibold sm:px-7">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex items-center gap-1.5",
              i === step
                ? "text-accent"
                : i < step
                  ? "text-primary"
                  : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-full border text-[11px]",
                i === step
                  ? "border-accent bg-accent text-white"
                  : i < step
                    ? "border-primary bg-primary text-white"
                    : "border-border",
              )}
            >
              {i < step ? <Check className="size-3" aria-hidden /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-7">
        {/* Step 1 — Service */}
        {step === 0 && (
          <fieldset>
            <legend className="text-lg font-semibold text-primary">
              Which service do you need?
            </legend>
            <p className="mt-1 text-sm text-muted-foreground">
              Not sure? Choose a consultation and the clinician will advise.
            </p>
            <div className="mt-5 space-y-6">
              {grouped.map(([category, list]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {CATEGORY_LABEL[category]}
                  </h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {list.map((service) => (
                      <label
                        key={service.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border p-3 text-sm transition-colors",
                          values.service_slug === service.slug
                            ? "border-accent bg-teal-50"
                            : "border-border hover:border-navy-200",
                        )}
                      >
                        <input
                          type="radio"
                          value={service.slug}
                          className="mt-1 accent-[var(--color-accent)]"
                          {...register("service_slug", {
                            required: "Please choose a service",
                          })}
                        />
                        <span>
                          <span className="font-semibold text-primary">
                            {service.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {service.short_description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.service_slug && (
              <p className="mt-3 text-sm text-danger">
                {errors.service_slug.message}
              </p>
            )}
          </fieldset>
        )}

        {/* Step 2 — Doctor */}
        {step === 1 && (
          <fieldset>
            <legend className="text-lg font-semibold text-primary">
              Do you have a preferred clinician?
            </legend>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional — we&apos;ll assign a suitable clinician if you have no
              preference.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[var(--radius)] border p-3.5 text-sm transition-colors",
                  !values.doctor_slug
                    ? "border-accent bg-teal-50"
                    : "border-border hover:border-navy-200",
                )}
              >
                <input
                  type="radio"
                  value=""
                  className="accent-[var(--color-accent)]"
                  {...register("doctor_slug")}
                />
                <span className="font-semibold text-primary">No preference</span>
              </label>
              {doctors.map((doctor) => (
                <label
                  key={doctor.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[var(--radius)] border p-3.5 text-sm transition-colors",
                    values.doctor_slug === doctor.slug
                      ? "border-accent bg-teal-50"
                      : "border-border hover:border-navy-200",
                  )}
                >
                  <input
                    type="radio"
                    value={doctor.slug}
                    className="accent-[var(--color-accent)]"
                    {...register("doctor_slug")}
                  />
                  <span>
                    <span className="font-semibold text-primary">
                      {doctor.name}
                    </span>
                    {doctor.title && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {doctor.title}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Step 3 — Date */}
        {step === 2 && (
          <fieldset>
            <legend className="text-lg font-semibold text-primary">
              Choose a date
            </legend>
            <p className="mt-1 text-sm text-muted-foreground">
              The clinic is open all seven days. You can request a date up to{" "}
              {BOOKING_WINDOW_DAYS} days ahead.
            </p>
            <div className="mt-4 flex justify-center rounded-[var(--radius-lg)] border border-border p-3 sm:justify-start">
              <DayPicker
                mode="single"
                weekStartsOn={1}
                selected={
                  values.appointment_date
                    ? new Date(`${values.appointment_date}T00:00:00`)
                    : undefined
                }
                onSelect={(date) => {
                  setValue(
                    "appointment_date",
                    date ? toDateInputValue(date) : "",
                    { shouldValidate: true },
                  );
                  setValue("appointment_time", "");
                }}
                disabled={{ before: today, after: maxDate }}
                classNames={{
                  today: "font-bold text-accent",
                  selected:
                    "bg-primary text-primary-foreground rounded-md",
                  chevron: "fill-accent",
                }}
              />
            </div>
            <input
              type="hidden"
              {...register("appointment_date", {
                required: "Please choose a date",
              })}
            />
            {values.appointment_date && (
              <p className="mt-3 text-sm text-primary">
                Selected: <strong>{formatDate(values.appointment_date, { weekday: "long" })}</strong>
              </p>
            )}
          </fieldset>
        )}

        {/* Step 4 — Time */}
        {step === 3 && (
          <fieldset>
            <legend className="text-lg font-semibold text-primary">
              Choose a time
            </legend>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing available slots for{" "}
              {values.appointment_date
                ? formatDate(values.appointment_date, { weekday: "long" })
                : "the selected date"}
              .
            </p>
            <div className="mt-4">
              {slotsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Loading times…
                </div>
              ) : slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() =>
                        setValue("appointment_time", slot.time, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "rounded-[var(--radius)] border px-2 py-2.5 text-sm font-semibold transition-colors",
                        values.appointment_time === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : slot.available
                            ? "border-border hover:border-accent hover:text-accent"
                            : "cursor-not-allowed border-dashed border-border text-muted-foreground/50 line-through",
                      )}
                    >
                      {formatTime(slot.time)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="rounded-[var(--radius)] border border-dashed border-border bg-surface p-4 text-sm text-muted-foreground">
                  {slotMessage ??
                    "No times available for this date. Please choose another date."}
                </p>
              )}
            </div>
            <input
              type="hidden"
              {...register("appointment_time", {
                required: "Please choose a time slot",
              })}
            />
          </fieldset>
        )}

        {/* Step 5 — Details */}
        {step === 4 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-primary">
              Your details
            </legend>

            <div className="rounded-[var(--radius)] border border-border bg-surface p-3 text-sm">
              <p className="font-semibold text-primary">Appointment summary</p>
              <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                <li>Service: {selectedService?.title ?? "—"}</li>
                <li>Clinician: {selectedDoctor?.name ?? "No preference"}</li>
                <li>
                  Date:{" "}
                  {values.appointment_date
                    ? formatDate(values.appointment_date, { weekday: "long" })
                    : "—"}
                </li>
                <li>
                  Time:{" "}
                  {values.appointment_time
                    ? formatTime(values.appointment_time)
                    : "—"}
                </li>
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="patient_name">
                  Full name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="patient_name"
                  autoComplete="name"
                  aria-invalid={!!errors.patient_name}
                  className="mt-1.5"
                  {...register("patient_name", {
                    required: "Please enter your full name",
                    minLength: { value: 2, message: "Please enter your full name" },
                  })}
                />
                {errors.patient_name && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.patient_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">
                  Phone number <span className="text-danger">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  aria-invalid={!!errors.phone}
                  className="mt-1.5"
                  {...register("phone", {
                    required: "Please enter your mobile number",
                    pattern: {
                      value: /^(?:\+?91[-\s]?)?[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-danger">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="mt-1.5"
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="message">Message / concern (optional)</Label>
              <Textarea
                id="message"
                rows={4}
                className="mt-1.5"
                placeholder="Briefly describe your concern so we can prepare for your visit."
                {...register("message", {
                  maxLength: { value: 1000, message: "Message is too long" },
                })}
              />
            </div>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={values.consent}
                onCheckedChange={(checked) =>
                  setValue("consent", checked === true, {
                    shouldValidate: true,
                  })
                }
                aria-invalid={!!errors.consent}
              />
              <span className="text-muted-foreground">
                I agree to be contacted regarding this appointment.{" "}
                <span className="text-danger">*</span>
              </span>
            </label>
            <input
              type="checkbox"
              className="hidden"
              {...register("consent", {
                required: "Please agree to be contacted about this appointment",
              })}
            />
            {errors.consent && (
              <p className="text-xs text-danger">{errors.consent.message}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Submitting sends an appointment <strong>request</strong>. Our team
              will confirm your slot by phone or WhatsApp. See our{" "}
              <Link href="/privacy-policy" className="underline">
                privacy policy
              </Link>
              .
            </p>

            {result && !result.ok && result.error && (
              <p className="rounded-[var(--radius)] border border-danger/30 bg-red-50 px-3 py-2 text-sm text-danger">
                {result.error}
              </p>
            )}
          </fieldset>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-7">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={step === 0 || pending}
          className={step === 0 ? "invisible" : undefined}
        >
          <ArrowLeft aria-hidden />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="default" onClick={goNext}>
            Continue
            <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button type="submit" variant="gold" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                <CalendarCheck aria-hidden />
                Request Appointment
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

function Confirmation({
  appointment,
  persisted,
}: {
  appointment: NonNullable<AppointmentActionResult["appointment"]>;
  persisted?: boolean;
}) {
  const waMessage = `Hello, I have requested an appointment at ${siteConfig.name}.

Name: ${appointment.patient_name}
Service: ${appointment.service_label}${
    appointment.doctor_label ? `\nClinician: ${appointment.doctor_label}` : ""
  }
Date: ${formatDate(appointment.appointment_date, { weekday: "long" })}
Time: ${formatTime(appointment.appointment_time)}
Appointment ID: ${appointment.reference}`;

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-background p-6 text-center sm:p-10">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-teal-100 text-accent">
        <Check className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-2xl">Appointment request received</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Thank you, {appointment.patient_name.split(" ")[0]}. Our team will
        contact you shortly to confirm your slot.
        {!persisted &&
          " Please also send us the details on WhatsApp so we don't miss your request."}
      </p>

      <dl className="mx-auto mt-6 grid max-w-sm gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Appointment ID</dt>
          <dd className="font-semibold text-primary">{appointment.reference}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="text-primary">{appointment.patient_name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Service</dt>
          <dd className="text-primary">{appointment.service_label}</dd>
        </div>
        {appointment.doctor_label && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Clinician</dt>
            <dd className="text-primary">{appointment.doctor_label}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Date</dt>
          <dd className="text-primary">
            {formatDate(appointment.appointment_date, { weekday: "long" })}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Time</dt>
          <dd className="text-primary">
            {formatTime(appointment.appointment_time)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="whatsapp">
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden />
            WhatsApp Clinic
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={siteConfig.phone.tel}>
            <Phone aria-hidden />
            Call Clinic
          </a>
        </Button>
      </div>
    </div>
  );
}
