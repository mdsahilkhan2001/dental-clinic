import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        {action}
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary sm:inline-flex"
        >
          View site
          <ExternalLink className="size-3.5" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
