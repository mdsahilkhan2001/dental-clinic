import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { HoursForm } from "@/components/admin/hours-form";
import { getClinicHours } from "@/lib/data";
import { hasServiceRole } from "@/lib/supabase/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Clinic Settings" };

export default async function AdminSettingsPage() {
  const hours = await getClinicHours();

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Clinic settings"
        description="Opening hours drive the appointment slots patients can request."
      />

      <section>
        <h2 className="text-lg">Opening hours</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          The clinic is open all seven days by default. Adjust each day below.
        </p>
        {!hasServiceRole ? (
          <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
            Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to change opening hours.
          </p>
        ) : (
          <HoursForm hours={hours} />
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <h2 className="text-lg">Clinic contact details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Name, address, phone and WhatsApp are set in{" "}
          <code>src/lib/site.ts</code> so they stay identical everywhere (NAP
          consistency for local SEO). Update that file and redeploy to change
          them.
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-primary">{siteConfig.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="text-primary">{siteConfig.phone.display}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Address</dt>
            <dd className="text-primary">{siteConfig.address.full}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
