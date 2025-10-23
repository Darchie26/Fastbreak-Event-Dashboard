'use client'

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface Banner {
  id: string
  title: string
  description: string
  image_url: string
  link_url: string | null
}

interface ManualBannerCarouselProps {
  banners: Banner[]
}

export function ManualBannerCarousel({ banners }: ManualBannerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div className="w-full mb-8">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="border-none bg-white/5 backdrop-blur-md border-[#17f2e3]/20 overflow-hidden">
                <CardContent className="p-0">
                  {banner.link_url ? (
                    <Link href={banner.link_url} target="_blank" rel="noopener noreferrer">
                      <BannerContent banner={banner} />
                    </Link>
                  ) : (
                    <BannerContent banner={banner} />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4 bg-white/10 backdrop-blur-sm border-[#17f2e3]/30 text-white hover:bg-[#17f2e3]/20" />
            <CarouselNext className="right-4 bg-white/10 backdrop-blur-sm border-[#17f2e3]/30 text-white hover:bg-[#17f2e3]/20" />
          </>
        )}
      </Carousel>

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? 'w-8 bg-[#17f2e3]'
                  : 'w-2 bg-gray-500'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BannerContent({ banner }: { banner: Banner }) {
  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[21/6] overflow-hidden group cursor-pointer">
      <Image
        src={banner.image_url}
        alt={banner.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      {/* Text content */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-3 drop-shadow-lg">
          {banner.title}
        </h2>
        <p className="text-base md:text-xl text-gray-200 drop-shadow-md">
          {banner.description}
        </p>
      </div>
    </div>
  )
}
