'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { stages } from './XMLParser'
import { useXmlParser } from '@/app/admin/context'
import { Button } from '@/components/ui/button'

const values = ["String", "Color", "Number", "Unit"] as const;

interface Param {
  name: string
  value: string
  type: typeof values[number]
}

interface Product {
  id: string
  name: string
  images: string[]
  isAvailable: boolean
  quantity: number
  url: string
  priceToShow: number
  price: number
  category: string
  vendor: string
  description: string
  params: Param[]
}

export default function ProductPreview({ setCurrentStage }: { setCurrentStage: React.Dispatch<React.SetStateAction<keyof typeof stages>> }) {
    const [product, setProduct] = useState<Product>({
        id: "",
        name: "",
        images: [],
        isAvailable: false,
        quantity: 0,
        url: "",
        priceToShow: 0,
        price: 0,
        category: "",
        vendor: "",
        description: "",
        params: []
    })

    const { sample } = useXmlParser();

    useEffect(() => {
        setProduct(JSON.parse(sample || ""));
    }, [sample])


    const handleGetItems = () => {
        setCurrentStage("get-data")
    }
    return (
        <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle className="text-heading2-bold font-bold">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={product.id} readOnly />
            </div>
            <div>
                <Label htmlFor="available">Available</Label>
                <Switch id="available" checked={product.isAvailable} />
            </div>
            </div>

            <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={product.name} readOnly/>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" value={product.quantity} readOnly/>
            </div>
            <div>
                <Label htmlFor="url">URL</Label>
                <Input id="url" value={product.url} readOnly/>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" value={product.price} readOnly/>
            </div>
            <div>
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input id="discountPrice" value={product.priceToShow} readOnly/>
            </div>
            </div>

            <div>
            <Label htmlFor="images">Images</Label>
            <div className="flex flex-wrap gap-2">
                {product.images.map((image, index) => (
                <img key={index} src={image} alt={`Product ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                ))}
            </div>
            </div>

            <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" value={product.vendor} readOnly/>
            </div>

            <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={product.description} rows={4} readOnly/>
            </div>

            <div>
            <Label>Parameters</Label>
            <div className="space-y-2">
                {product.params.map((param, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <Input value={param.name} placeholder="Name" className="w-1/3" readOnly/>
                    <Input value={param.value} placeholder="Value" className="w-1/3" readOnly/>
                    <Select defaultValue={param.type} onValueChange={(value: typeof values[number]) => setProduct((prev) => {
                                const updatedParams = [...prev.params]; 
                                updatedParams[index] = { ...updatedParams[index], type: value };
                                return { ...prev, params: updatedParams };
                                })}>
                    <SelectTrigger className="w-1/3">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {values.map((value, index) => (
                            <SelectItem key={index} value={value}>{value}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    {param.type === "Unit" && (
                        <Input value={param.type} placeholder="Unit name (cm)" className="w-1/12"/>
                    )}
                </div>
                ))}
            </div>
            </div>

            <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={product.category} readOnly/>
            </div>

            <Button onClick={handleGetItems}>Start</Button>
        </CardContent>
        </Card>
    )
}

