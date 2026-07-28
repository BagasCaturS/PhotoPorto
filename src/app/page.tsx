import Header from "@/components/Header"
import Hero from "@/components/Hero"
import InfiniteGridBackground from "@/components/InfiniteGridBackground"
import GalleryGrid from "@/components/GalleryGrid"
import FeaturedSection from "@/components/FeaturedSection"
import About from "@/components/About"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import SocialLinks from "@/components/ui/social-links"
import ScrollTimeline from "@/components/ScrollTimeline"
import { fallbackPhotos, categories_all, type Photo } from "@/data/photos"
import { createClient } from "@/lib/supabase/server"
import { getProxiedUrl } from "@/lib/utils"

export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()

  const [galleryResult, heroResult, featuredResult] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("selected", true)
      .order("display_order", { ascending: true }),
    supabase.from("photos").select("url").eq("is_hero", true).maybeSingle(),
    supabase
      .from("photos")
      .select("id, url, title, description")
      .eq("is_featured", true)
      .order("display_order", { ascending: true }),
  ])

  const data = galleryResult.data
  const heroSrc = heroResult.data?.url ? getProxiedUrl(heroResult.data.url) : null
  const featuredData = (featuredResult.data || []).map((f) => ({
    ...f,
    url: getProxiedUrl(f.url),
  }))

  let photos: Photo[] = fallbackPhotos

  if (data && data.length > 0) {
    photos = data.map((p, idx) => {
      const normalized = categories_all.find(
        (c) => c.toLowerCase() === (p.category || "").toLowerCase()
      )
      return {
        id: p.id,
        src: getProxiedUrl(p.url),
        title: p.title || p.filename.replace(/\.[^.]+$/, ""),
        description: p.description || "",
        category: normalized || categories_all[(p.display_order ?? idx) % categories_all.length],
        width: 2400,
        height: 3600,
      }
    })
  }

  return (
    <>
      <Header />
      <InfiniteGridBackground>
        <main>
          <Hero heroSrc={heroSrc} />
          <GalleryGrid photos={photos} categories={categories_all} />
          <FeaturedSection photos={featuredData} />
          <About />
          <Contact />
        </main>
      </InfiniteGridBackground>
      <ScrollTimeline />
      <SocialLinks
        links={[
          { platform: "linkedin", href: "https://www.linkedin.com/in/web-bagascaturs/" },
          { platform: "instagram", href: "https://www.instagram.com/idont_do_art/" },
          { platform: "github", href: "https://github.com/BagasCaturS" },
        ]}
        showOnMobile={false}
        floatingButtonColor="bg-zinc-800 dark:bg-zinc-700"
      />
      <Footer />
    </>
  )
}