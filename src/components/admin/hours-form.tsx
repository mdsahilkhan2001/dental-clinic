"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitBar } from "@/components/admin/form-kit";
import { saveClinicHoursAction } from "@/app/actions/admin/content";
import type { NormalizedDayHours } from "@/lib/data";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type DayState = {
  day_of_week: number;
  is_open: boolean;
  morning_start: string;
  morning_end: string;
  evening_start: string;
  evening_end: string;
};

export function HoursForm({ hours }: { hours: NormalizedDayHours[] }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const initial: DayState[] = [0, 1, 2, 3, 4, 5, 6].map((day) => {
    const row = hours.find((h) => h.day_of_week === day);
    return {
      day_of_week: day,
      is_open: row?.is_open ?? true,
      morning_start: row?.morning_start ?? "09:00",
      morning_end: row?.morning_end ?? "14:00",
      evening_start: row?.evening_start ?? "16:00",
      evening_end: row?.evening_end ?? "20:00",
    };
  });
  const [days, setDays] = React.useState<DayState[]>(initial);

  function update(index: number, patch: Partial<DayState>) {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await saveClinicHoursAction({
        days: days.map((d) => ({
          day_of_week: d.day_of_week,
          is_open: d.is_open,
          morning_start: d.is_open ? d.morning_start || null : null,
          morning_end: d.is_open ? d.morning_end || null : null,
          evening_start: d.is_open ? d.evening_start || null : null,
          evening_end: d.is_open ? d.evening_end || null : null,
        })),
      });
      if (res.ok) {
        toast.success("Opening hours updated.");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="p-3">Day</th>
              <th className="p-3">Open</th>
              <th className="p-3">Morning</th>
              <th className="p-3">Evening</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={d.day_of_week} className="border-b border-border last:border-0">
                <td className="p-3 font-medium text-primary">
                  {DAYS[d.day_of_week]}
                </td>
                <td className="p-3">
                  <Checkbox
                    checked={d.is_open}
                    onCheckedChange={(c) => update(i, { is_open: c === true })}
                    aria-label={`${DAYS[d.day_of_week]} open`}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="time"
                      value={d.morning_start}
                      disabled={!d.is_open}
                      onChange={(e) =>
                        update(i, { morning_start: e.target.value })
                      }
                      className="h-9 w-28"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      value={d.morning_end}
                      disabled={!d.is_open}
                      onChange={(e) =>
                        update(i, { morning_end: e.target.value })
                      }
                      className="h-9 w-28"
                    />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="time"
                      value={d.evening_start}
                      disabled={!d.is_open}
                      onChange={(e) =>
                        update(i, { evening_start: e.target.value })
                      }
                      className="h-9 w-28"
                    />
                    <span className="text-muted-foreground">–</span>
                    <Input
                      type="time"
                      value={d.evening_end}
                      disabled={!d.is_open}
                      onChange={(e) =>
                        update(i, { evening_end: e.target.value })
                      }
                      className="h-9 w-28"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Leave an evening range blank for a single-shift day. Appointment slots are
        generated in 30-minute steps within these ranges.
      </p>
      <SubmitBar pending={pending} label="Save opening hours" />
    </form>
  );
}
