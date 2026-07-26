"use client"

import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 dark:bg-dark-background">
      <div className="text-center">
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-accent mb-4">
          Something Went Wrong
        </p>
        <h1 className="font-sans text-5xl font-bold text-foreground dark:text-dark-foreground sm:text-6xl">
          Unexpected Frame
        </h1>
        <p className="mx-auto mt-6 max-w-md font-mono text-base text-secondary dark:text-dark-secondary">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 font-mono text-sm font-medium text-foreground transition-all duration-300 hover:bg-muted dark:border-dark-border dark:text-dark-foreground dark:hover:bg-dark-muted"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    </div>
  )
}
