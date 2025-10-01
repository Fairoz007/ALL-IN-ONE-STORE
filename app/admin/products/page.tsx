"use client"

import useSWR from "swr"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ImageBrowser } from "@/components/image-browser"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductsPage() {
  const { data: products, mutate } = useSWR("/api/products", fetcher)
  const { data: categories } = useSWR("/api/categories", fetcher)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [categoryId, setCategoryId] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const addProduct = async () => {
    if (!name || !price || !categoryId) {
      toast.error("Please fill in all required fields.")
      return
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description, price: Number(price), category_id: categoryId, image_url: imageUrl }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add product")
      }
      setName("")
      setDescription("")
      setPrice("")
      setCategoryId("")
      setImageUrl("")
      mutate()
      toast.success("Product added successfully!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      mutate()
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="font-serif text-3xl">Products</h1>

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
                <ImageBrowser onImageSelect={setImageUrl} initialUrl={imageUrl} />
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
        <div className="md:col-span-2">
          <Button onClick={addProduct}>Add Product</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="w-40">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(products) && products.map((p: any) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{categories?.find((c: any) => c.id === p.category_id)?.name}</TableCell>
              <TableCell>₹{Number(p.price).toFixed(2)}</TableCell>
              <TableCell>{p.unique_code}</TableCell>
              <TableCell className="space-x-2">
                <Button asChild variant="outline" size="sm">
                  <a href={`/admin/products/${p.id}/edit`}>Edit</a>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteProduct(p.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
