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
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.05]">
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </div>
        <motion.div
          className="absolute inset-0 opacity-35"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 dark:bg-orange-600/10 blur-[120px]" />
          <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-primary/15 blur-[100px]" />
          <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[120px]" />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}

const GridPattern = ({
  offsetX,
  offsetY,
}: {
  offsetX: ReturnType<typeof useMotionValue<number>>
  offsetY: ReturnType<typeof useMotionValue<number>>
}) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="page-grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#page-grid-pattern)" />
    </svg>
  )
}
