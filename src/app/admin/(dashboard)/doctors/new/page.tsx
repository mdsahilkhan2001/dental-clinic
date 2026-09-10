import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { DoctorForm } from "@/components/admin/doctor-form";

export const metadata: Metadata = { title: "New doctor" };

export default function NewDoctorPage() {
  return (
    <div className="space-y-6">
      <AdminHeader title="New doctor" description="Add a clinician profile." />
      <DoctorForm />
    </div>
  );
}
