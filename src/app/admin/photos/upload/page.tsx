"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import UploadForm from "@/components/admin/UploadForm"

export default function UploadPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/photos")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-border hover:text-foreground dark:border-dark-border/60 dark:text-dark-secondary dark:hover:border-dark-border dark:hover:text-dark-foreground"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div>
          <h2 className="font-sans text-2xl font-bold">Upload Photos</h2>
          <p className="mt-1 font-mono text-xs text-secondary dark:text-dark-secondary">
            Add new photos to your library
          </p>
        </div>
      </div>

      <UploadForm onUploadComplete={async () => router.push("/admin/photos")} />
    </div>
  )
}
