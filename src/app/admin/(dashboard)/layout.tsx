import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth";

// The admin dashboard is always per-request (auth + live data) — never
// prerendered or cached.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col bg-surface lg:flex-row">
      <AdminSidebar email={session.email} />
      <div className="flex-1">
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
