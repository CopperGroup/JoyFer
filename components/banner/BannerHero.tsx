import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BannerHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <Image
        src="/assets/banner-hero.jpg"
        alt="Fashion model in Scandinavian attire"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
        className="opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent">
        <div className="container mx-auto h-full flex items-center">
          <div className="max-w-2xl space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Scandinavian
              <br />
              <span className="text-neutral-300">Elegance</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 max-w-xl">
              Embrace the essence of Nordic minimalism with our curated collection of timeless fashion pieces.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" className="bg-white text-black rounded-none hover:bg-neutral-200 px-8 py-6 text-lg">
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white rounded-none hover:bg-white/10 px-8 py-6 text-lg"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

