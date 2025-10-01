"use client"

import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import Filters from "@/components/filters"
import ProductCard from "@/components/product-card"
import { CartDrawer } from "@/components/cart-drawer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4">
      <Navbar />
      <Hero />
      <Products />
      <CartDrawer />
    </main>
  )
}

function Hero() {
  return (
    <section className="py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-serif text-pretty text-4xl md:text-5xl">Curated Luxury for the Modern Wardrobe</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Elevate your essentials with premium shirts and refined footwear. Minimal design, maximal craftsmanship.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rounded-xl object-cover w-full h-64 md:h-80"
          alt="Luxury lifestyle"
          src="/luxury-fashion-editorial-minimal-wardrobe.jpg"
        />
      </div>
    </section>
  )
}

function Products() {
  const { data: categories } = useSWR("/api/categories", fetcher)
  const { data: products, mutate } = useSWR("/api/products", fetcher)
  async function setCategory(id?: string) {
    const url = id ? `/api/products?categoryId=${id}` : "/api/products"
    const data = await fetcher(url)
    mutate(data, false)
  }

  return (
    <section className="py-8 space-y-6">
      {categories?.length ? <Filters categories={categories} onChange={setCategory} /> : null}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
