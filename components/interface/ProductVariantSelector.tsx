"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

type VariantOption = {
  _id: string
  value: string
}

type SelectParams = Record<string, VariantOption[]>

type ProductVariantSelectorProps = {
  selectParams: SelectParams,
  productId: string
}

export default function ProductVariantSelector({ selectParams, productId }: ProductVariantSelectorProps) {

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const router = useRouter()

  // Initialize selectedVariants with the current productId as default
  useEffect(() => {
    const initialVariants: Record<string, string> = {}

    Object.entries(selectParams).forEach(([param, options]) => {
      const defaultOption = options.find(option => option._id === productId)
      if (defaultOption) {
        initialVariants[param] = defaultOption._id
      }
    })

    setSelectedVariants(initialVariants)
  }, [selectParams, productId])

  const handleVariantChange = (param: string, value: string) => {
    const newVariants = { ...selectedVariants, [param]: value }
    setSelectedVariants(newVariants)

    router.push(`/catalog/${value}`)
  }

  return (
    <div className="space-y-6">
      {Object.entries(selectParams).map(([param, options]) => (
        <div key={param} className="space-y-2">
          <h3 className="text-base-semibold">{param}</h3>
          <Select
            value={selectedVariants[param]} // Set the current value
            onValueChange={(value) => handleVariantChange(param, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${param}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option._id} value={option._id}>
                  <span className="text-small-medium">{option.value}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}
