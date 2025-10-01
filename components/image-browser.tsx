'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { ImageUploader } from './image-uploader'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function ImageBrowser({
  onImageSelect,
  initialUrl,
}: {
  onImageSelect: (url: string) => void
  initialUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(initialUrl || null)
  const { data: images, mutate } = useSWR('/api/images', fetcher)

  const handleImageSelect = (url: string) => {
    setSelectedUrl(url)
  }

  const handleConfirmSelection = () => {
    if (selectedUrl) {
      onImageSelect(selectedUrl)
    }
    setOpen(false)
  }

  const handleUploadComplete = (url: string) => {
    mutate() // Re-fetch the list of images
    setSelectedUrl(url) // Auto-select the newly uploaded image
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex items-center gap-4'>
          <div className='relative w-32 h-32 rounded-md overflow-hidden border'>
            {initialUrl ? (
              <Image src={initialUrl} alt='Selected image' layout='fill' objectFit='cover' />
            ) : (
              <div className='w-full h-full bg-secondary flex items-center justify-center'>
                <span className='text-muted-foreground text-sm'>Select Image</span>
              </div>
            )}
          </div>
          <Button type='button' variant='outline'>
            Browse
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-4xl h-[80vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Image Browser</DialogTitle>
        </DialogHeader>
        <div className='flex-grow grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 overflow-y-auto border-y'>
          {images?.map((image: any) => (
            <div
              key={image.id}
              className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-4 ${
                selectedUrl === image.url ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => handleImageSelect(image.url)}
            >
              <Image src={image.url} alt={image.name} layout='fill' objectFit='cover' />
            </div>
          ))}
        </div>
        <div className='p-4'>
          <ImageUploader onUploaded={handleUploadComplete} label='Upload New Image' />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmSelection} disabled={!selectedUrl}>
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
