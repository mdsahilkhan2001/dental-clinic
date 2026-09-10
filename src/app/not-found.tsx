import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-6 text-center">
      <div className="max-w-md">
        <p className="font-serif text-6xl font-semibold text-navy-800">404</p>
        <h1 className="mt-3 text-2xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="default">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/appointment">Book an appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
