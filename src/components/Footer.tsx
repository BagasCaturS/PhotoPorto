export default function Footer() {
  return (
    <footer className="border-t border-border dark:border-dark-border">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-sans text-sm font-semibold tracking-tight">
            Sapporo°Dr
          </p>
          <p className="font-mono text-xs text-secondary dark:text-dark-secondary">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
