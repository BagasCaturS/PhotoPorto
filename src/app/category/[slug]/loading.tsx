export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background dark:bg-dark-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground dark:border-dark-foreground/20 dark:border-t-dark-foreground" />
    </div>
  )
}
