import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { ServiceForm } from "@/components/admin/service-form";
import { adminGetServiceById } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await adminGetServiceById(id);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Edit — ${service.title}`}
        description="Changes go live immediately on save."
      />
      <ServiceForm service={service} />
    </div>
  );
}
