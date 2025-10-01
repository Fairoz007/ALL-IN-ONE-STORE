"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUploader } from "@/components/image-uploader"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const { data: category } = useSWR(id ? `/api/categories/${id}` : null, fetcher)

  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (category) {
      setName(category.name)
      setImageUrl(category.image_url)
    }
  }, [category])

  const updateCategory = async () => {
    if (!name.trim()) return
    await fetch(`/api/categories/${id}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, image_url: imageUrl }),
      }
    )
    router.push("/admin/categories")
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} />
          <ImageUploader onUploaded={(url) => setImageUrl(url)} initialUrl={imageUrl} label="Upload Category Image" />
        </CardContent>
        <CardFooter className="space-x-2">
          <Button onClick={updateCategory}>Update Category</Button>
          <Button variant="outline" onClick={() => router.push("/admin/categories")}>Cancel</Button>
        </CardFooter>
      </Card>
    </section>
  )
}