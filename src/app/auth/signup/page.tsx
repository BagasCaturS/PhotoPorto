"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch("/api/auth/can-signup")
      .then((r) => r.json())
      .then((d) => setAllowed(d.allowed))
      .catch(() => setAllowed(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const err = await signUp(email, password)
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  if (allowed === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-dark-background">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-sans text-3xl font-bold">Sign Up Disabled</h1>
          <p className="mt-4 font-mono text-sm text-secondary dark:text-dark-secondary">
            An admin account already exists. Sign up is no longer available.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background dark:bg-dark-foreground dark:text-dark-background"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (allowed === null) return null

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-dark-background">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-sans text-3xl font-bold">Account Created</h1>
          <p className="mt-4 font-mono text-sm text-secondary dark:text-dark-secondary">
            Since you&apos;re the first user, you&apos;ve been granted admin
            access. You can now sign in.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background dark:bg-dark-foreground dark:text-dark-background"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 dark:bg-dark-background">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-sans text-3xl font-bold">Create Account</h1>
          <p className="mt-2 font-mono text-sm text-secondary dark:text-dark-secondary">
            First user becomes admin
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
              minLength={6}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-sm text-secondary dark:text-dark-secondary">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}