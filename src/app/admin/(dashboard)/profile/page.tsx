import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/admin-header";
import { requireAdmin } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Admin Profile" };

export default async function AdminProfilePage() {
  const session = await requireAdmin("/admin/profile");

  return (
    <div className="space-y-6">
      <AdminHeader title="Admin profile" description="Your account details." />

      <div className="rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-primary">
              {session.admin.full_name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-primary">{session.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <Badge variant="accent" className="capitalize">
                {session.admin.role.replace("_", " ")}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="text-primary">
              {new Date(session.admin.created_at).toLocaleDateString("en-IN")}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-border bg-background p-6 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-primary">Password</h2>
        <p className="mt-1">
          Passwords are managed by Supabase Auth. To change yours, use the
          &ldquo;Forgot password&rdquo; flow from the Supabase dashboard, or ask
          a super admin to send a reset email. Add new admins by creating a
          Supabase Auth user and inserting a matching row into{" "}
          <code>admin_users</code> (see the project README).
        </p>
      </div>

      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>

      <p className="text-xs text-muted-foreground">
        Signed in to {siteConfig.name} admin.
      </p>
    </div>
  );
}
