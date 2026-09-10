import { Skeleton } from "@/components/ui/skeleton";

export default function WebsiteLoading() {
  return (
    <div className="container-page py-16">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-4 h-12 w-3/4 max-w-xl" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  );
}
