import type { Metadata } from "next"
import { archivo, spaceGrotesk } from "./fonts"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | Photography Portfolio",
    default: "Photography Portfolio",
  },
  description:
    "A curated collection of visual stories — minimalist photography portfolio showcasing light, shadow, and moment.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
