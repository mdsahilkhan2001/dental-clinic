import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { DoctorForm } from "@/components/admin/doctor-form";
import { adminGetDoctorById } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit doctor" };

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await adminGetDoctorById(id);
  if (!doctor) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader title={`Edit — ${doctor.name}`} />
      <DoctorForm doctor={doctor} />
    </div>
  );
}
