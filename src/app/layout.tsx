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
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var o=new MutationObserver(function(m){m.forEach(function(n){if(n.type==="attributes"&&n.attributeName==="bis_skin_checked"){n.target.removeAttribute("bis_skin_checked")}})});o.observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:["bis_skin_checked"]});var e=document.querySelectorAll("[bis_skin_checked]");for(var i=0;i<e.length;i++){e[i].removeAttribute("bis_skin_checked")}})()`,
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
