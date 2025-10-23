'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value?: File
  onChange: (file: File | undefined) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(undefined)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
          <Image
            src={preview}
            alt="Event poster preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            'w-full aspect-video rounded-lg border-2 border-dashed border-gray-300',
            'hover:border-gray-400 transition-colors',
            'flex flex-col items-center justify-center gap-2',
            'text-gray-500 hover:text-gray-600',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">Upload Event Poster</span>
          <span className="text-xs text-gray-400">
            PNG, JPG, WEBP up to 5MB
          </span>
        </button>
      )}
    </div>
  )
}