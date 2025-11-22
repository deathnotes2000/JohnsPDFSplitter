"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { SplitAnimation } from "@/components/split-animation"

interface UploadZoneProps {
  onUpload: (file: File) => void
  loading: boolean
  error: string | null
}

export function UploadZone({ onUpload, loading, error }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === "application/pdf") {
        onUpload(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      onUpload(files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`w-full border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        dragActive ? "border-primary bg-primary/5 scale-105" : "border-border bg-card hover:bg-muted/50"
      } ${loading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleChange} disabled={loading} className="hidden" />

      <div className="flex flex-col items-center justify-center gap-4">
        {loading ? (
          <SplitAnimation />
        ) : (
          <div className={`p-4 rounded-full ${dragActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            <Upload size={32} />
          </div>
        )}

        <div>
          <p className="text-lg font-semibold text-foreground mb-1">
            {loading ? "Processing PDF..." : "Drop your PDF here"}
          </p>
          <p className="text-sm text-muted-foreground">
            {loading ? "Please wait while we split your PDF" : "or click to browse"}
          </p>
        </div>
      </div>
    </div>
  )
}
