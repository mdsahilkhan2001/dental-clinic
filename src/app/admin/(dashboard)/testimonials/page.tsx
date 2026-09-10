import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { adminGetTestimonials } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await adminGetTestimonials();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Testimonials"
        description="Add, edit, publish or unpublish patient feedback."
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to manage testimonials.
        </p>
      ) : (
        <TestimonialsManager testimonials={testimonials} />
      )}
    </div>
  );
}
