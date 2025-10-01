"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

export function ImageUploader({
  onUploaded,
  initialUrl,
  label = "Upload Image",
}: { onUploaded: (url: string) => void; initialUrl?: string | null; label?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null)

  useEffect(() => {
    setPreviewUrl(initialUrl || null)
  }, [initialUrl])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1MB")
      return
    }

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file)
    setPreviewUrl(tempUrl)

    setLoading(true)
    setError(null)
    try {
      const data = new FormData()
      data.set("file", file)
      const res = await fetch("/api/blob/upload", { method: "POST", body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Upload failed")
      onUploaded(json.url)
      setPreviewUrl(json.url) // Update to the final URL
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An unknown error occurred")
      setPreviewUrl(initialUrl || null) // Revert on error
    } finally {
      setLoading(false)
      if (tempUrl) URL.revokeObjectURL(tempUrl) // Clean up temporary URL
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      {previewUrl && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden">
          <Image src={previewUrl} alt="Image preview" layout="fill" objectFit="cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <span className="px-3 py-2 rounded-md bg-primary text-primary-foreground cursor-pointer">
            {loading ? "Uploading..." : label}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            aria-label="Product image upload"
            disabled={loading}
          />
        </label>
        {error ? <span className="text-destructive text-sm">{error}</span> : null}
      </div>
    </div>
  )
}
