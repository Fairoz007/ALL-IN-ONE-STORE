"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/image-uploader"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const { data: product } = useSWR(id ? `/api/products/${id}` : null, fetcher)
  const { data: categories } = useSWR("/api/categories", fetcher)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setPrice(product.price)
      setCategoryId(product.category_id)
      setImageUrl(product.image_url)
    }
  }, [product])

  const updateProduct = async () => {
    if (!name || !price || !categoryId) return
    await fetch(`/api/products/${id}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description, price: Number(price), category_id: categoryId, image_url: imageUrl }),
      }
    )
    router.push("/admin/products")
  }

  return (
    <section className="space-y-6">
      <h1 className="font-serif text-3xl">Edit Product</h1>

      <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Textarea
          className="md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ImageUploader onUploaded={setImageUrl} initialUrl={imageUrl} />
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="md:col-span-2 space-x-2">
          <Button onClick={updateProduct}>Update Product</Button>
          <Button variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
        </div>
      </div>
    </section>
  )
}