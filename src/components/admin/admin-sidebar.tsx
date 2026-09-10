"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminNav } from "./admin-nav";
import { signOutAction } from "@/app/actions/auth";

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {adminNav.map(({ label, href, Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(href, exact)
              ? "bg-navy-800 text-white"
              : "text-navy-200 hover:bg-navy-800/60 hover:text-white",
          )}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900 px-4 py-3 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="font-serif text-sm">Jeevan Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-9 items-center justify-center rounded-md border border-navy-700"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-navy-800 bg-navy-900 p-4 lg:hidden">
          {nav}
          <form action={signOutAction} className="mt-3">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full border-navy-700 text-navy-100 hover:text-white"
            >
              <LogOut aria-hidden /> Sign out
            </Button>
          </form>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-4 border-r border-navy-800 bg-navy-900 p-4 text-white lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 py-2">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-sm">Jeevan Clinic</span>
            <span className="text-[11px] text-navy-300">Admin dashboard</span>
          </span>
        </Link>
        {nav}
        <div className="border-t border-navy-800 pt-3">
          <p className="truncate px-2 text-xs text-navy-300" title={email}>
            {email}
          </p>
          <form action={signOutAction} className="mt-2">
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="w-full border-navy-700 text-navy-100 hover:text-white"
            >
              <LogOut aria-hidden /> Sign out
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
