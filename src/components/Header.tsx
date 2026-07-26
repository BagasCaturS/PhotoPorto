"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

function getNavLinks(pathname: string, isAdmin: boolean) {
  const isHome = pathname === "/"
  const links = [
    { label: "Gallery", href: isHome ? "#gallery" : "/#gallery" },
    { label: "About", href: "/#about" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: isHome ? "#contact" : "/#contact" },
  ]
  if (isAdmin) {
    links.splice(1, 0, { label: "Admin", href: "/admin" })
  }
  return links
}

export default function Header() {
  const pathname = usePathname()
  const { user, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const navItems = getNavLinks(pathname, isAdmin)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border dark:bg-dark-background/80 dark:border-dark-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="font-sans text-lg font-semibold tracking-tight"
        >
          Portfolio
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground dark:hover:text-dark-foreground transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          {user ? (
            <button
              onClick={signOut}
              className="font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground dark:hover:text-dark-foreground transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <a
              href="/auth/login"
              className="font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground dark:hover:text-dark-foreground transition-colors duration-200"
            >
              Login
            </a>
          )}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 backdrop-blur-md dark:border-dark-border dark:bg-dark-background/95">
          <div className="flex flex-col gap-2 px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground dark:hover:text-dark-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => {
                  setOpen(false)
                  signOut()
                }}
                className="py-2 text-left font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <a
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-sm font-medium text-secondary dark:text-dark-secondary hover:text-foreground transition-colors"
              >
                Login
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
