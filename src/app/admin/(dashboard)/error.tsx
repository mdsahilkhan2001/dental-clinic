"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-background p-10 text-center">
      <h1 className="text-xl">Couldn&apos;t load this page</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Please try again. If it keeps happening, check your Supabase
        configuration and connection.
      </p>
      <Button onClick={reset} variant="default" className="mt-5">
        Try again
      </Button>
    </div>
  );
}
