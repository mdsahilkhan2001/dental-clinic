import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  CircleSlash,
  Clock,
  XCircle,
} from "lucide-react";

import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge, EnquiryStatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminGetDashboard } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";
import { formatDate, formatTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await adminGetDashboard();

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard"
        description="Appointment activity and recent enquiries at a glance."
      />

      {!hasServiceRole && (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          <strong>Read-only preview.</strong> Add{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to your environment to load live
          data and enable admin changes.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total" value={stats.total} Icon={CalendarDays} href="/admin/appointments" />
        <StatCard label="Pending" value={stats.pending} Icon={Clock} tone="gold" href="/admin/appointments?status=pending" />
        <StatCard label="Confirmed" value={stats.confirmed} Icon={CalendarCheck} tone="accent" href="/admin/appointments?status=confirmed" />
        <StatCard label="Completed" value={stats.completed} Icon={CheckCircle2} tone="accent" href="/admin/appointments?status=completed" />
        <StatCard label="Cancelled" value={stats.cancelled} Icon={XCircle} tone="danger" href="/admin/appointments?status=cancelled" />
        <StatCard label="No show" value={stats.no_show} Icon={CircleSlash} href="/admin/appointments?status=no_show" />
      </div>

      <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg">
            <CalendarClock className="size-5 text-accent" aria-hidden />
            Today&apos;s appointments
          </h2>
          <Link
            href="/admin/appointments"
            className="text-xs font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {stats.today.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.today.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-semibold">
                    {formatTime(a.appointment_time)}
                  </TableCell>
                  <TableCell>{a.patient_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {a.service_label ?? "—"}
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${a.phone}`} className="text-accent">
                      {a.phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No appointments scheduled for today.
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <h2 className="mb-3 text-lg">Upcoming appointments</h2>
          {stats.upcoming.length > 0 ? (
            <ul className="divide-y divide-border text-sm">
              {stats.upcoming.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-medium text-primary">{a.patient_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(a.appointment_date)} ·{" "}
                      {formatTime(a.appointment_time)} · {a.service_label ?? "—"}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing upcoming.
            </p>
          )}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <h2 className="mb-3 text-lg">Recent enquiries</h2>
          {stats.recentEnquiries.length > 0 ? (
            <ul className="divide-y divide-border text-sm">
              {stats.recentEnquiries.map((e) => (
                <li key={e.id} className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-primary">{e.name}</p>
                    <EnquiryStatusBadge status={e.status} />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {e.subject ? `${e.subject} — ` : ""}
                    {e.message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    <a href={`tel:${e.phone}`} className="text-accent">
                      {e.phone}
                    </a>{" "}
                    · {formatDate(e.created_at.slice(0, 10))}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No enquiries yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
