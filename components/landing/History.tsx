"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Store } from "@/constants/store"

const milestones = [
  { year: 2010, event: `Заснування ${Store.name}` },
  { year: 2013, event: "Відкриття першого фізичного магазину" },
  { year: 2016, event: "Запуск лінії еко-френдлі одягу" },
  { year: 2019, event: "Розширення на міжнародний ринок" },
  { year: 2022, event: "Відкриття флагманського магазину в Києві" },
]

export default function History() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-neutral-900 text-white"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-heading1-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Наша Історія
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                  <span className="text-heading4-medium">{milestone.year}</span>
                </div>
                <div className="pt-4">
                  <p className="text-base-semibold">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="relative aspect-[1/1]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Image
              src="/assets/history-image.jpg"
              alt={`${Store.name} through the years`}
              layout="fill"
              objectFit="cover"
              className="rounded-sm"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

