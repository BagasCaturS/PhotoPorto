"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectTo = searchParams.get("redirect") || "/admin"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      router.refresh()
      router.replace(redirectTo)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-dark-background">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-3xl font-bold">Sign In</h1>
          <p className="mt-2 font-mono text-sm text-secondary dark:text-dark-secondary">
            Admin access only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent dark:border-dark-border dark:focus:border-dark-accent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-sm text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-full bg-foreground py-3 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50 dark:bg-dark-foreground dark:text-dark-background"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        
      </div>
    </div>
  )
}