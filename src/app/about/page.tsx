import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-foreground dark:bg-dark-foreground">
          <Image
            src="/photography/_DSF0109.webp"
            alt="Photographer portrait"
            fill
            className="object-cover opacity-50"
            preload
            sizes="100vw"
          />
          <div className="relative z-10 text-center">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-4">
              About
            </p>
            <h1 className="font-sans text-5xl font-bold text-gray-600 sm:text-7xl">
              The Story Behind<br />the Lens
            </h1>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-8 font-mono text-base leading-relaxed text-secondary dark:text-dark-secondary">
              <p className="text-lg text-foreground dark:text-dark-foreground">
                I&apos;m a photographer based in Bandung, capturing moments that
                tell stories without words. My work spans portrait, landscape,
                and street photography — always searching for the frame that
                reveals something true about the world.
              </p>
              <p>
                Every photograph is a conversation between light and shadow, a
                fragment of time frozen in a frame. I seek the extraordinary in
                the ordinary — the way morning light falls on concrete, the
                geometry of urban spaces, the quiet poetry of a passing moment.
              </p>
              <p>
                My approach is rooted in patience and observation. I believe
                that the best images are not created but discovered — they exist
                already in the world, waiting for someone to notice them. My
                role is simply to be present, to see clearly, and to frame what
                I find with honesty and intention.
              </p>
              <p>
                I work exclusively with natural light, preferring the
                authenticity it brings to an image. Whether it&apos;s the warm
                glow of golden hour or the dramatic shadows of midday, natural
                light offers an honesty that artificial lighting often masks.
              </p>
            </div>

            <div className="mt-20">
              <h2 className="font-sans text-3xl font-bold mb-8">Approach & Philosophy</h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {[
                  {
                    title: "Patience",
                    desc: "The best moments can't be rushed. I wait for the light, the gesture, the alignment of elements that transforms a scene into an image.",
                  },
                  {
                    title: "Authenticity",
                    desc: "I don't stage or direct. The most powerful photographs are those that capture genuine moments — unposed, unrehearsed, true.",
                  },
                  {
                    title: "Simplicity",
                    desc: "Minimal gear, minimal interference, minimal post-processing. I strive to let the subject speak without unnecessary embellishment.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border p-6 dark:border-dark-border"
                  >
                    <h3 className="font-sans text-lg font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="font-mono text-sm leading-relaxed text-secondary dark:text-dark-secondary">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-24 dark:border-dark-border">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-sans text-3xl font-bold sm:text-4xl">
              Let&apos;s Create Together
            </h2>
            <p className="mt-4 font-mono text-base text-secondary dark:text-dark-secondary">
              Interested in working together? I&apos;m available for portrait
              sessions, event coverage, and creative collaborations.
            </p>
            <a
              href="/#contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 font-mono text-sm font-medium text-background transition-all duration-300 hover:bg-foreground/90 dark:bg-dark-foreground dark:text-dark-background"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
