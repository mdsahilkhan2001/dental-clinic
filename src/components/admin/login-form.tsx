"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/app/actions/auth";

type Values = { email: string; password: string };

export function LoginForm({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/admin";
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (data) => {
    setPending(true);
    try {
      const res = await signInAction(data, redirectTo);
      // On success the action redirects; only failures return here.
      if (res && !res.ok) {
        toast.error(res.error ?? "Sign in failed.");
        setPending(false);
      }
    } catch {
      // A thrown NEXT_REDIRECT means success — let Next handle navigation.
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-background p-7 shadow-[var(--shadow-card)]"
    >
      <h1 className="text-xl">Staff sign in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Access the {`Jeevan`} clinic admin dashboard.
      </p>

      {!configured && (
        <p className="mt-4 rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-3 py-2 text-xs text-gold-800">
          Supabase is not configured yet. Add the environment variables from{" "}
          <code>.env.example</code> and create an admin user to enable sign in.
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            className="mt-1.5"
            aria-invalid={!!errors.email}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1.5"
            aria-invalid={!!errors.password}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" variant="default" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              <LogIn aria-hidden />
              Sign in
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
