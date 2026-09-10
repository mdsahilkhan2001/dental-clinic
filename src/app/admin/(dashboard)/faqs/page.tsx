import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { FaqsManager } from "@/components/admin/faqs-manager";
import { adminGetFaqs } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  const faqs = await adminGetFaqs();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="FAQs"
        description="Manage questions shown on the FAQ page, service pages and the homepage."
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to manage FAQs.
        </p>
      ) : (
        <FaqsManager faqs={faqs} />
      )}
    </div>
  );
}
