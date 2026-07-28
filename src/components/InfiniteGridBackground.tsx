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
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: gridCSS,
            backgroundSize: "40px 40px",
            backgroundPosition: bgPosition,
          }}
        />

        <motion.div
          className="absolute -top-[30%] -right-[15%] w-[50%] aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(217 91% 60% / 0.25), transparent 70%)",
          }}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-[30%] -left-[15%] w-[50%] aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(190 80% 50% / 0.2), transparent 70%)",
          }}
          animate={{
            x: [0, -20, 15, 0],
            y: [0, 15, -10, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
