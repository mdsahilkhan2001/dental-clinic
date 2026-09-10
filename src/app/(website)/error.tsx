"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function WebsiteError({
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
    <div className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again. If the problem continues, contact the clinic on{" "}
          <a href={siteConfig.phone.tel} className="font-semibold text-accent">
            {siteConfig.phone.display}
          </a>
          .
        </p>
        <Button onClick={reset} className="mt-6" variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}
