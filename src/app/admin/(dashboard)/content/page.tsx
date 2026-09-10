import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm } from "@/components/admin/content-form";
import { getSiteContent } from "@/lib/data";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Content" };

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Homepage content"
        description="Edit the hero, about, why-choose-us, CTA and footer text without touching code. Fallback content stays in the codebase."
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to save content changes.
        </p>
      ) : (
        <ContentForm content={content} />
      )}
    </div>
  );
}
