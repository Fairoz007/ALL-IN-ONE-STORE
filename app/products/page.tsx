"use client"

import useSWR from "swr"
import Link from "next/link"
import Filters from "@/components/filters"
import ProductCard from "@/components/product-card"
import { Navbar } from "@/components/navbar"
import { CartDrawer } from "@/components/cart-drawer"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProductsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4">
      <Navbar />
      <Header />
      <AllProducts />
      <CategorySections />
      <CartDrawer />
    </main>
  )
}

function Header() {
  return (
    <section className="py-8">
      <h1 className="font-serif text-pretty text-4xl md:text-5xl">All Products</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Explore our full collection. Filter by category or browse curated sections below.
      </p>
    </section>
  )
}

function AllProducts() {
  const { data: categories } = useSWR("/api/categories", fetcher)
  const { data: products, mutate } = useSWR("/api/products", fetcher)

  async function setCategory(id?: string) {
    const url = id ? `/api/products?categoryId=${id}` : "/api/products"
    const data = await fetcher(url)
    mutate(data, false)
  }

  return (
    <section className="py-6 space-y-6">
      {categories?.length ? <Filters categories={categories} onChange={setCategory} /> : null}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

// Category sections: Shoes, Dresses, Men, Women
function CategorySections() {
  const targetNames = ["Shoes", "Dresses", "Men", "Women"]
  const { data: categories } = useSWR("/api/categories", fetcher)

  if (!categories?.length) return null

  const lookup = new Map<string, any>()
  for (const c of categories) lookup.set(c.name.toLowerCase(), c)

  const targets = targetNames
    .map((name) => ({ name, cat: lookup.get(name.toLowerCase()) }))
    .filter((t) => Boolean(t.cat)) as { name: string; cat: { id: string; name: string } }[]

  if (!targets.length) return null

  return (
    <section className="py-10 space-y-10">
      {targets.map(({ name, cat }) => (
        <CategoryBlock key={cat.id} title={name} categoryId={cat.id} />
      ))}
    </section>
  )
}

function CategoryBlock({ title, categoryId }: { title: string; categoryId: string }) {
  const { data: products } = useSWR(`/api/products?categoryId=${categoryId}`, fetcher)

  if (!products?.length) return null

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl">{title}</h2>
        <Link
          href={`/products?categoryId=${categoryId}`}
          className="text-sm underline text-muted-foreground hover:text-foreground"
        >
          View all {title}
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
