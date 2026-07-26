export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-800 ${className}`}
    />
  )
}

export function TextSkeleton({ width = "w-full" }: { width?: string }) {
  return <Skeleton className={`h-3 ${width}`} />
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-800 p-6">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function JournalCardSkeleton({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] ${reverse ? "" : ""}`}>
      <div className={`${reverse ? "lg:order-2" : ""}`}>
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      </div>
      <div className={`space-y-3 ${reverse ? "lg:order-1" : ""}`}>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[50vh] w-full rounded-none" />
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
