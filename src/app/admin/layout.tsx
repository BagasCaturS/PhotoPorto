"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/auth/login?redirect=/admin")
    }
  }, [isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-10">
            <h1 className="font-sans text-3xl font-bold">Admin Panel</h1>
          </div>
          <nav className="mb-12 flex flex-wrap gap-x-6 gap-y-2 border-b border-border pb-4 dark:border-dark-border">
            {[
              { label: "Dashboard", href: "/admin" },
              { label: "Photos", href: "/admin/photos" },
              { label: "Upload", href: "/admin/photos/upload" },
              { label: "Assign", href: "/admin/photos/manage" },
              { label: "About", href: "/admin/about" },
              { label: "Journals", href: "/admin/journals" },
              { label: "Messages", href: "/admin/messages" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-sm font-medium text-secondary transition-colors hover:text-foreground dark:text-dark-secondary dark:hover:text-dark-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
