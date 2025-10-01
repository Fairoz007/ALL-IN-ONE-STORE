"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/image-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminContent() {
  const { data: categories, mutate: mutateCategories } = useSWR("/api/categories", fetcher)
  const { mutate: mutateProducts } = useSWR("/api/products", fetcher)

  // Category form
  const [catName, setCatName] = useState("")
  const [catSlug, setCatSlug] = useState("")
  const [catImg, setCatImg] = useState<string | null>(null)

  async function createCategory() {
    if (!catName || !catSlug) return
    await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: catName, slug: catSlug, main_image_url: catImg }),
    })
    setCatName("")
    setCatSlug("")
    setCatImg(null)
    mutateCategories()
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    mutateCategories()
  }

  // Product form
  const [pTitle, setPTitle] = useState("")
  const [pDesc, setPDesc] = useState("")
  const [pPrice, setPPrice] = useState<number>(0)
  const [pCat, setPCat] = useState<string | null>(null)
  const [pImg, setPImg] = useState<string | null>(null)

  async function createProduct() {
    if (!pTitle || !pPrice) return
    await fetch("/api/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: pTitle,
        description: pDesc,
        price_cents: Math.round(Number(pPrice) * 100),
        category_id: pCat,
        main_image_url: pImg,
        is_active: true,
      }),
    })
    setPTitle("")
    setPDesc("")
    setPPrice(0)
    setPCat(null)
    setPImg(null)
    mutateProducts()
  }

  return (
    <div className="grid gap-10">
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Manage Categories</h2>
        <div className="grid gap-3">
          {(categories ?? []).map((c: any) => (
            <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {c.main_image_url ? (
                  <img src={c.main_image_url} alt={c.name} className="h-10 w-10 rounded-md object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted" />
                )}
                <span className="font-medium">{c.name}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteCategory(c.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Create Category</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <Input placeholder="Slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} />
          <ImageUploader onUploaded={(url) => setCatImg(url)} />
        </div>
        {catImg ? <p className="text-sm text-muted-foreground break-all">Image: {catImg}</p> : null}
        <div className="mt-3">
          <Button onClick={createCategory}>Add Category</Button>
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Create Product</h2>
        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Title" value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
            <Input
              placeholder="Price (e.g., 199.99)"
              type="number"
              step="0.01"
              value={pPrice}
              onChange={(e) => setPPrice(Number.parseFloat(e.target.value))}
            />
          </div>
          <Textarea placeholder="Description" value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
          <div className="grid gap-3 md:grid-cols-2">
            <Select onValueChange={setPCat} value={pCat ?? undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {(categories ?? []).map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ImageUploader onUploaded={(url) => setPImg(url)} />
          </div>
          {pImg ? <p className="text-sm text-muted-foreground break-all">Image: {pImg}</p> : null}
          <div>
            <Button onClick={createProduct}>Add Product</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

async function deleteCategory(id: string) {
  await fetch(`/api/categories?id=${id}`, { method: "DELETE" })
  mutateCategories()
}
