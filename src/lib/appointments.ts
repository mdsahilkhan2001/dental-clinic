import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getClinicHours } from "@/lib/data";
import type { ClinicHourRow } from "@/types/database";
import {
  BOOKING_WINDOW_DAYS,
  MIN_LEAD_MINUTES,
  SLOT_MINUTES,
} from "@/lib/appointments.constants";

export { BOOKING_WINDOW_DAYS, MIN_LEAD_MINUTES, SLOT_MINUTES };

function toMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function shiftSlots(start: string | null, end: string | null): string[] {
  if (!start || !end) return [];
  const from = toMinutes(start);
  const to = toMinutes(end);
  if (to <= from) return [];
  const slots: string[] = [];
  for (let t = from; t + SLOT_MINUTES <= to; t += SLOT_MINUTES) {
    slots.push(fromMinutes(t));
  }
  return slots;
}

/** All slots the clinic could offer on a given weekday, ignoring bookings. */
export function slotsForDay(row: ClinicHourRow): string[] {
  if (!row.is_open) return [];
  return [
    ...shiftSlots(row.morning_start, row.morning_end),
    ...shiftSlots(row.evening_start, row.evening_end),
  ];
}

export interface AvailabilityResult {
  date: string;
  isOpen: boolean;
  slots: { time: string; available: boolean }[];
  message?: string;
}

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * Availability for a date: generated slots minus any already taken by an
 * active (pending/confirmed) appointment. Past slots are excluded for today.
 */
export async function getAvailability(
  dateStr: string,
): Promise<AvailabilityResult> {
  if (!isValidDateString(dateStr)) {
    return { date: dateStr, isOpen: false, slots: [], message: "Invalid date." };
  }

  const target = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const todayStr = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 10);

  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + BOOKING_WINDOW_DAYS);

  if (dateStr < todayStr) {
    return { date: dateStr, isOpen: false, slots: [], message: "That date has passed." };
  }
  if (target > maxDate) {
    return {
      date: dateStr,
      isOpen: false,
      slots: [],
      message: `Please choose a date within the next ${BOOKING_WINDOW_DAYS} days.`,
    };
  }

  const hours = await getClinicHours();
  const weekday = target.getDay();
  const dayRow = hours.find((h) => h.day_of_week === weekday);

  if (!dayRow || !dayRow.is_open) {
    return {
      date: dateStr,
      isOpen: false,
      slots: [],
      message: "The clinic is closed on this day.",
    };
  }

  let generated = slotsForDay(dayRow);

  if (dateStr === todayStr) {
    const cutoff = now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MINUTES;
    generated = generated.filter((slot) => toMinutes(slot) >= cutoff);
  }

  let taken = new Set<string>();
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("appointment_date", dateStr)
        .in("status", ["pending", "confirmed"]);
      taken = new Set(
        (data ?? []).map((r) => String(r.appointment_time).slice(0, 5)),
      );
    } catch {
      taken = new Set();
    }
  }

  const slots = generated.map((time) => ({
    time,
    available: !taken.has(time),
  }));

  return {
    date: dateStr,
    isOpen: true,
    slots,
    message: slots.some((s) => s.available)
      ? undefined
      : "All slots for this day are booked. Please choose another date.",
  };
}

/** Server-side check used before inserting — defence in depth with the DB constraint. */
export async function isSlotFree(
  dateStr: string,
  timeStr: string,
): Promise<boolean> {
  const availability = await getAvailability(dateStr);
  if (!availability.isOpen) return false;
  return availability.slots.some((s) => s.time === timeStr && s.available);
}
