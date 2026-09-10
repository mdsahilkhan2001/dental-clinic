import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminHeader } from "@/components/admin/admin-header";
import { PublishedBadge } from "@/components/admin/status-badge";
import { RowActions } from "@/components/admin/resource-row-actions";
import {
  deleteDoctorAction,
  toggleDoctorPublishedAction,
} from "@/app/actions/admin/doctors";
import { adminGetDoctors } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Doctors" };

export default async function AdminDoctorsPage() {
  const doctors = await adminGetDoctors();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Doctors"
        description="Add and manage clinician profiles."
        action={
          <Button asChild variant="default" size="sm">
            <Link href="/admin/doctors/new">
              <Plus aria-hidden /> New doctor
            </Link>
          </Button>
        }
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to manage doctors.
        </p>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No doctors yet.
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Link
                        href={`/admin/doctors/${d.id}`}
                        className="font-medium text-primary hover:text-accent"
                      >
                        {d.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">/{d.slug}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {d.title ?? "—"}
                    </TableCell>
                    <TableCell>{d.display_order}</TableCell>
                    <TableCell>
                      <PublishedBadge published={d.published} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        id={d.id}
                        editHref={`/admin/doctors/${d.id}`}
                        published={d.published}
                        toggleAction={toggleDoctorPublishedAction}
                        deleteAction={deleteDoctorAction}
                        deleteTitle={`Delete "${d.name}"?`}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
