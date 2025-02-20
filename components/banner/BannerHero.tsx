"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import LinkButton from "../interface/LinkButton"
import Image from "next/image"

export default function BannerHero({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full flex justify-center items-center bg-yellow-400 py-16 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[1680px] flex flex-col lg:flex-row justify-between items-center px-12 max-lg:px-9 max-[500px]:px-7 relative">
        <motion.div
          className="flex flex-col items-start space-y-6 lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1
            className="font-bold max-[1380px]:text-[72px] max-[1380px]:leading-[81px] max-[1260px]:text-[64px] max-[1260px]:leading-[72px] max-[1130px]:text-[60px] max-[1130px]:leading-[67px] max-[1070px]:text-[56px] max-[1070px]:leading-[63px] max-[425px]:text-[40px] max-[425px]:leading-[45px] max-[335px]:text-[36px] max-[335px]:leading-[40px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Build Your Imagination
          </motion.h1>
          <motion.p
            className="text-body-medium text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Discover endless possibilities with our collection of LEGO-like toys and other exciting playthings. Let your
            creativity soar!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <LinkButton href="/catalog" type="primary">
              Explore Our Catalog
            </LinkButton>
          </motion.div>
        </motion.div>
        <motion.div
          className="lg:w-1/2 mt-10 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full max-[1260px]:pt-5 max-[1130px]:pt-12 max-[1023px]:pt-0 max-[768px]:h-fit max-[768px]:max-h-[400px]">
            <div className="w-full h-full overflow-hidden shadow-lg">
              <Carousel className="w-full mx-auto max-md:w-full max-h-96">
                <CarouselContent>
                  {[
                    "lego-city",
                    "lego-space",
                    "lego-castle",
                  ].map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={`/assets/1.jpg`}
                        alt={`Toy showcase ${index + 1}`}
                        width={800}
                        height={450}
                        objectFit="cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <CarouselPrevious className="bg-white bg-opacity-70 hover:bg-opacity-100" />
                  <CarouselNext className="bg-white bg-opacity-70 hover:bg-opacity-100" />
                </div>
              </Carousel>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

