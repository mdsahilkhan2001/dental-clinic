import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { adminGetAppointments } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Appointments" };

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const appointments = await adminGetAppointments();
  const services = Array.from(
    new Set(appointments.map((a) => a.service_label).filter(Boolean)),
  ) as string[];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Appointments"
        description="Review requests, confirm slots and update status. Double-booking is blocked at the database level."
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to load and manage
          appointments.
        </p>
      ) : (
        <AppointmentsTable
          appointments={appointments}
          services={services}
          initialStatus={status ?? "all"}
        />
      )}
    </div>
  );
}
