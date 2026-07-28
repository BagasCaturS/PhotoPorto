"use client"

import { type ReactNode } from "react"
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "motion/react"

interface Props {
  children: ReactNode
}

export default function InfiniteGridBackground({ children }: Props) {
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 1) % 40)
    gridOffsetY.set((gridOffsetY.get() + 1) % 40)
  })

  const bgPosition = useMotionTemplate`${gridOffsetX}px ${gridOffsetY}px`

  const gridCSS =
    "linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px), " +
    "linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)"

  return (
    <div className="relative min-h-screen">
      <motion.div
        className="fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: gridCSS,
          backgroundSize: "40px 40px",
          backgroundPosition: bgPosition,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
