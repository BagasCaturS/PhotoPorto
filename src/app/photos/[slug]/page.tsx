import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { fallbackPhotos } from "@/data/photos"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const photo = fallbackPhotos.find((p) => p.id === slug)
  if (!photo) return {}

  return {
    title: photo.title,
    description: photo.description,
  }
}

export async function generateStaticParams() {
  return fallbackPhotos.map((p) => ({ slug: p.id }))
}

export default async function PhotoPage({ params }: Props) {
  const { slug } = await params
  const photo = fallbackPhotos.find((p) => p.id === slug)
  if (!photo) notFound()

  const index = fallbackPhotos.findIndex((p) => p.id === slug)
  const prev = index > 0 ? fallbackPhotos[index - 1] : null
  const next = index < fallbackPhotos.length - 1 ? fallbackPhotos[index + 1] : null

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/#gallery"
          className="inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-6">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
          <Image
            src={photo.src}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            className="h-auto w-full object-contain max-h-[80vh]"
            preload
            sizes="100vw"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-blue-400 mb-2">
            {photo.category}
          </p>
          <h1 className="font-sans text-3xl font-bold text-white sm:text-4xl">
            {photo.title}
          </h1>
          <p className="mt-4 font-mono text-base leading-relaxed text-white/60">
            {photo.description}
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between">
          {prev ? (
            <Link
              href={`/photos/${prev.id}`}
              className="group inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              {prev.title}
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/photos/${next.id}`}
              className="group inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
            >
              {next.title}
              <ArrowLeft
                size={16}
                className="rotate-180 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
