import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        title="New service"
        description="Add a treatment. It will appear on the website once published."
      />
      <ServiceForm />
    </div>
  );
}
