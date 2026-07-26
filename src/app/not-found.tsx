import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 dark:bg-dark-background">
      <div className="text-center">
        <p className="font-mono text-sm tracking-[0.2em] uppercase text-accent mb-4">
          Error 404
        </p>
        <h1 className="font-sans text-6xl font-bold text-foreground dark:text-dark-foreground sm:text-8xl">
          Lost Frame
        </h1>
        <p className="mx-auto mt-6 max-w-md font-mono text-base text-secondary dark:text-dark-secondary">
          The page you&apos;re looking for doesn&apos;t exist. It may have been
          moved, deleted, or never existed in the first place.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  )
}
