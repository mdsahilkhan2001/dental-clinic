"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  CheckCheck,
  Eye,
  Loader2,
  Phone,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { formatDate, formatTime } from "@/lib/utils";
import {
  deleteAppointmentAction,
  updateAppointmentStatusAction,
} from "@/app/actions/admin/appointments";
import type { AppointmentRow, AppointmentStatus } from "@/types/database";

const STATUS_FILTERS: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

export function AppointmentsTable({
  appointments,
  services,
  initialStatus = "all",
}: {
  appointments: AppointmentRow[];
  services: string[];
  initialStatus?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<string>(
    STATUS_FILTERS.some((f) => f.value === initialStatus)
      ? initialStatus
      : "all",
  );
  const [service, setService] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<AppointmentRow | null>(null);

  // `appointments` is refreshed from the server after every mutation.
  const filtered = appointments.filter((row) => {
    if (status !== "all" && row.status !== status) return false;
    if (service !== "all" && row.service_label !== service) return false;
    if (query) {
      const q = query.toLowerCase();
      const hay = `${row.patient_name} ${row.phone} ${row.reference} ${
        row.email ?? ""
      }`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  async function setRowStatus(id: string, next: AppointmentStatus) {
    setBusyId(id);
    try {
      const res = await updateAppointmentStatusAction({ id, status: next });
      if (res.ok) {
        toast.success(`Marked ${next.replace("_", " ")}.`);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone or ID"
            className="pl-9"
            aria-label="Search appointments"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
          aria-label="Filter by status"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="h-11 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
          aria-label="Filter by service"
        >
          <option value="all">All services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date &amp; time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No appointments match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium text-primary">{row.patient_name}</p>
                    <p className="text-xs text-muted-foreground">{row.reference}</p>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${row.phone}`} className="text-accent">
                      {row.phone}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.service_label ?? "—"}
                    {row.doctor_label ? (
                      <span className="block text-xs">{row.doctor_label}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(row.appointment_date)}
                    <span className="block text-xs text-muted-foreground">
                      {formatTime(row.appointment_time)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="View details"
                        onClick={() => setDetail(row)}
                      >
                        <Eye className="size-4" aria-hidden />
                      </Button>
                      {busyId === row.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden />
                      ) : (
                        <>
                          {row.status !== "confirmed" &&
                            row.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Confirm"
                                onClick={() => setRowStatus(row.id, "confirmed")}
                              >
                                <Check className="size-4 text-teal-600" aria-hidden />
                              </Button>
                            )}
                          {row.status !== "completed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Mark completed"
                              onClick={() => setRowStatus(row.id, "completed")}
                            >
                              <CheckCheck className="size-4 text-teal-700" aria-hidden />
                            </Button>
                          )}
                          {row.status !== "cancelled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Cancel"
                              onClick={() => setRowStatus(row.id, "cancelled")}
                            >
                              <X className="size-4 text-red-600" aria-hidden />
                            </Button>
                          )}
                          <ConfirmButton
                            triggerLabel=""
                            triggerIcon={<Trash2 className="size-4 text-red-600" aria-hidden />}
                            variant="ghost"
                            size="icon"
                            destructive
                            title="Delete appointment?"
                            description="This permanently removes the appointment record. This cannot be undone."
                            confirmLabel="Delete"
                            onConfirm={() => deleteAppointmentAction(row.id)}
                            onDone={() => router.refresh()}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {appointments.length} appointments.
      </p>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment {detail?.reference}</DialogTitle>
          </DialogHeader>
          {detail && (
            <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Patient</dt>
              <dd className="text-primary">{detail.patient_name}</dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${detail.phone}`} className="text-accent">
                  {detail.phone}
                </a>
              </dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-primary">{detail.email ?? "—"}</dd>
              <dt className="text-muted-foreground">Service</dt>
              <dd className="text-primary">{detail.service_label ?? "—"}</dd>
              <dt className="text-muted-foreground">Clinician</dt>
              <dd className="text-primary">{detail.doctor_label ?? "No preference"}</dd>
              <dt className="text-muted-foreground">Date</dt>
              <dd className="text-primary">{formatDate(detail.appointment_date)}</dd>
              <dt className="text-muted-foreground">Time</dt>
              <dd className="text-primary">{formatTime(detail.appointment_time)}</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd><StatusBadge status={detail.status} /></dd>
              <dt className="text-muted-foreground">Message</dt>
              <dd className="text-primary">{detail.message ?? "—"}</dd>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-primary">{detail.source}</dd>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="text-primary">
                {formatDate(detail.created_at.slice(0, 10))}
              </dd>
            </dl>
          )}
          {detail && (
            <Button asChild variant="outline">
              <a href={`tel:${detail.phone}`}>
                <Phone aria-hidden /> Call patient
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
