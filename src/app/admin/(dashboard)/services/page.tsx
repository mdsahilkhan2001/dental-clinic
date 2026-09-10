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
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { PublishedBadge } from "@/components/admin/status-badge";
import { RowActions } from "@/components/admin/resource-row-actions";
import {
  deleteServiceAction,
  toggleServicePublishedAction,
} from "@/app/actions/admin/services";
import { adminGetServices } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await adminGetServices();

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Services"
        description="Create, edit and publish the treatments shown across the website."
        action={
          <Button asChild variant="default" size="sm">
            <Link href="/admin/services/new">
              <Plus aria-hidden /> New service
            </Link>
          </Button>
        }
      />

      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to manage services.
        </p>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No services yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="font-medium text-primary hover:text-accent"
                      >
                        {s.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">/{s.slug}</p>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {s.category}
                    </TableCell>
                    <TableCell>{s.display_order}</TableCell>
                    <TableCell>
                      {s.featured ? <Badge variant="gold">Featured</Badge> : "—"}
                    </TableCell>
                    <TableCell>
                      <PublishedBadge published={s.published} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        id={s.id}
                        editHref={`/admin/services/${s.id}`}
                        published={s.published}
                        toggleAction={toggleServicePublishedAction}
                        deleteAction={deleteServiceAction}
                        deleteTitle={`Delete "${s.title}"?`}
                        deleteDescription="The service page and its links will be removed from the site."
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
