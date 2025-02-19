"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Beaker from "../svg/Beaker"
import Image from "next/image"
import LinkButton from "../interface/LinkButton"
import { Store } from "@/constants/store"

const features = [
  { title: "Quality", description: "Premium materials for lasting play" },
  { title: "Imagination", description: "Spark creativity in young minds" },
  { title: "Safety", description: "Meeting highest safety standards" },
]

export default function AboutUs() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardRef.current !== null) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setCursor({ x: x, y: y })
    }
  }

  return (
    <section className="w-full bg-gray-100 py-20">
      <div className="px-4 md:px-6">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden bg-white shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 z-0">
            <Beaker cursor={cursor} cardRef={cardRef} />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 md:p-12">
            <div className="space-y-6">
              <motion.h2
                className="text-heading1-bold text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Discover {Store.name}
              </motion.h2>
              <motion.p
                className="text-body-medium text-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                At {Store.name}, we bring imagination to life through our high-quality building toys. Every brick is a
                gateway to endless possibilities and adventures.
              </motion.p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
                      <div className="w-6 h-6 bg-yellow-400 rounded-sm transform rotate-45" />
                    </div>
                    <div>
                      <h3 className="text-base-semibold text-black">{feature.title}</h3>
                      <p className="text-small-regular text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="w-full flex"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <LinkButton href="/about" type="primary">
                  Explore Our World
                </LinkButton>
              </motion.div>
            </div>
            <div className="relative h-[400px] overflow-hidden shadow-lg">
              <Image src="/assets/loginbackground.jpg" alt="Colorful toy bricks" layout="fill" objectFit="cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-heading3-bold mb-2">Build Your Dreams</h3>
                <p className="text-base-regular">Every brick is a step towards something amazing</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

