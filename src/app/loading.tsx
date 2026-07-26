export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background dark:bg-dark-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground dark:border-dark-foreground/20 dark:border-t-dark-foreground" />
        <p className="font-mono text-sm text-secondary dark:text-dark-secondary">
          Loading...
        </p>
      </div>
    </div>
  )
}
