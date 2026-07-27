"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ImageProps } from "next/image"

export default function ProtectedImage({
  className,
  containerClassName,
  ...props
}: ImageProps & { containerClassName?: string }) {
  const isFill = props.fill === true
  const isProxy = typeof props.src === "string" && props.src.startsWith("/api/images/")
  return (
    <div className={cn("relative select-none", isFill && "h-full w-full", containerClassName)}>
      <Image
        {...props}
        unoptimized={isProxy || props.unoptimized}
        className={cn("pointer-events-none", className)}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
        aria-hidden="true"
      />
    </div>
  )
}
