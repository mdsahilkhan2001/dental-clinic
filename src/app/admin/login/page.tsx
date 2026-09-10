import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Staff Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-6 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2.5"
        >
          <Image
            src="/images/logo.jpg"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
          <span className="font-serif text-sm font-semibold text-primary">
            {siteConfig.name}
          </span>
        </Link>
        <Suspense fallback={null}>
          <LoginForm configured={isSupabaseConfigured} />
        </Suspense>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
