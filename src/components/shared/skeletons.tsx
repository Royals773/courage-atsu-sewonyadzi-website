import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/** Grid of card-shaped skeletons, for book/insight/topic listing pages. */
export function CardGridSkeleton({
  count = 6,
  className = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8`}>
      <div className={`grid grid-cols-1 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <div className="p-4 pb-0">
              <Skeleton className="aspect-4/3 w-full rounded-lg" />
            </div>
            <CardContent className="flex flex-col gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** Two-column detail-page skeleton, for book/topic detail pages. */
export function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <Skeleton className="aspect-3/4 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-6 h-11 w-40" />
        </div>
      </div>
    </div>
  );
}

/** Single-column article skeleton, for blog post detail pages. */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-4 h-9 w-5/6" />
      <Skeleton className="mt-4 h-4 w-1/3" />
      <Skeleton className="mt-8 aspect-16/9 w-full rounded-lg" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Row-based skeleton for admin data tables. */
export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
