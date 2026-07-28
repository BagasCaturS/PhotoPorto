"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "motion/react"

interface Props {
  children: ReactNode
}

export default function InfiniteGridBackground({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 1) % 40)
    gridOffsetY.set((gridOffsetY.get() + 1) % 40)
  })

  const bgPosition = useMotionTemplate`${gridOffsetX}px ${gridOffsetY}px`
  const clipPath = useMotionTemplate`circle(150px at ${mouseX}px ${mouseY}px)`

  const gridCSS =
    "linear-gradient(to right, hsl(var(--muted-foreground)) 1px, transparent 1px), " +
    "linear-gradient(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)"

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <motion.div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: gridCSS,
            backgroundSize: "40px 40px",
            backgroundPosition: bgPosition,
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: gridCSS,
            backgroundSize: "40px 40px",
            backgroundPosition: bgPosition,
            clipPath,
            WebkitClipPath: clipPath,
          }}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/15 dark:bg-orange-600/8 blur-[120px]" />
          <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/15 dark:bg-blue-600/8 blur-[120px]" />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
