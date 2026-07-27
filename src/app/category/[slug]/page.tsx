import { notFound } from "next/navigation"
import { fallbackPhotos, categories_all } from "@/data/photos"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CategoryClient from "./CategoryClient"
import { getProxiedUrl } from "@/lib/utils"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const label = slug.charAt(0).toUpperCase() + slug.slice(1)
  if (!categories_all.map((c) => c.toLowerCase()).includes(slug)) return {}
  return {
    title: `${label} Photography`,
    description: `A curated collection of ${label.toLowerCase()} photography.`,
  }
}

export function generateStaticParams() {
  return categories_all.map((cat) => ({ slug: cat.toLowerCase() }))
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const label = slug.charAt(0).toUpperCase() + slug.slice(1)
  const valid = categories_all.map((c) => c.toLowerCase())

  if (!valid.includes(slug)) notFound()

  const filtered = fallbackPhotos
    .filter((p) => p.category.toLowerCase() === slug)
    .map((p) => ({ ...p, src: getProxiedUrl(p.src) }))

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
                Category
              </p>
              <h1 className="font-sans text-4xl font-bold sm:text-5xl">
                {label}
              </h1>
              <p className="mt-4 font-mono text-base text-secondary dark:text-dark-secondary">
                {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <CategoryClient photos={filtered} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
