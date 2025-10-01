"use client"

import useSWR from "swr"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageBrowser } from "@/components/image-browser"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CategoriesPage() {
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { data: categories, mutate } = useSWR("/api/categories", fetcher)

  const addCategory = async () => {
    if (!name.trim()) {
      toast.error("Category name cannot be empty.")
      return
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image_url: imageUrl }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add category")
      }
      setName("")
      setImageUrl(null)
      mutate()
      toast.success("Category added successfully!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const deleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      mutate()
    }
  }

  return (
    <section className="space-y-8">
      <h1 className="font-serif text-3xl">Categories</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <ImageBrowser onImageSelect={(url) => setImageUrl(url)} initialUrl={imageUrl} />
        </CardContent>
        <CardFooter>
          <Button onClick={addCategory}>Add Category</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories?.map((c: any) => (
          <Card key={c.id}>
            <CardHeader className="p-0">
              <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                {c.image_url ? (
                  <Image src={c.image_url} alt={c.name} layout="fill" objectFit="cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{c.name}</h3>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={`/admin/categories/${c.id}/edit`}>Edit</a>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deleteCategory(c.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}