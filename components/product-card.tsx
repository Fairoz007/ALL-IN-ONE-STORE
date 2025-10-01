"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useCart } from "@/components/store/cart"

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
  unique_code: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { add, open } = useCart()
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl border overflow-hidden bg-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          product.image_url || "/placeholder.svg?height=400&width=600&query=luxury%20fashion%20product%20photography"
        }
        alt={product.name}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.unique_code}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">₹{Number(product.price).toFixed(2)}</span>
          <Button
            onClick={() => {
              add({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                sku: product.unique_code,
                image_url: product.image_url,
              })
              open()
            }}
          >
            Add to Bag
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
