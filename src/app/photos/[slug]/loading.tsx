import Link from "next/link"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-6">
        <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 pb-6">
        <div className="aspect-[3/2] w-full max-h-[80vh] rounded-2xl bg-neutral-900 animate-pulse" />
      </div>
      <div className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-64 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
