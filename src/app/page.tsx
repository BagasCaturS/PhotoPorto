import Header from "@/components/Header"
import Hero from "@/components/Hero"
import GalleryGrid from "@/components/GalleryGrid"
import About from "@/components/About"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import { fallbackPhotos, categories_all, type Photo } from "@/data/photos"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  const [galleryResult, heroResult] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("selected", true)
      .order("display_order", { ascending: true }),
    supabase.from("photos").select("url").eq("is_hero", true).maybeSingle(),
  ])

  const data = galleryResult.data
  const heroSrc = heroResult.data?.url || null

  let photos: Photo[] = fallbackPhotos

  if (data && data.length > 0) {
    photos = data.map((p) => ({
      id: p.id,
      src: p.url,
      title: p.title || p.filename.replace(/\.[^.]+$/, ""),
      description: p.description || "",
      category: p.category || categories_all[p.display_order % categories_all.length],
      width: 2400,
      height: 3600,
    }))
  }

  return (
    <>
      <Header />
      <main>
        <Hero heroSrc={heroSrc} />
        <GalleryGrid photos={photos} categories={categories_all} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}