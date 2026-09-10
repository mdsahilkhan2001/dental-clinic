import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Jeevan Admin" },
  robots: { index: false, follow: false },
};

// This layout only carries metadata. The `/admin/login` route lives here
// without a guard; every dashboard route sits under `(dashboard)/` which has
// its own layout that enforces `requireAdmin()`.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
