'use client'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Building Sets", image: "/assets/1.jpg", href: "/catalog/building-sets" },
  { name: "Action Figures", image: "/assets/2.jpg", href: "/catalog/action-figures" },
  { name: "Educational Toys", image: "/assets/3.jpg", href: "/catalog/educational-toys" },
]

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section 
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-white to-gray-100 py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-[1680px] px-12 max-lg:px-9 max-[500px]:px-7">
          <motion.h2 
            className="text-heading2-bold text-black mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Toy Categories
          </motion.h2>
          <motion.div 
            className="w-16 h-1 bg-yellow-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 64 } : { width: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.p 
            className="text-body-medium text-gray-700 mb-16 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Explore our wide range of toys for every imagination
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative w-full h-[400px] overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl max-[425px]:h-[300px] max-[380px]:h-[250px]">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-80" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                      <h3 className="text-heading3-bold text-white text-center mb-2 transform transition-transform duration-300 group-hover:translate-y-[-10px]">{category.name}</h3>
                      <span className="text-base-medium text-black bg-yellow-400 px-4 py-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div 
        className="w-full flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link 
          href="/catalog" 
          className="text-base-semibold text-black hover:text-gray-800 transition-colors duration-300 relative group"
        >
          <span className="relative z-10">View All Categories</span>
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-all duration-300 group-hover:scale-x-100 scale-x-0"></span>
        </Link>
      </motion.div>
    </motion.section>
  )
}
