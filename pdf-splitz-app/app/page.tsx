"use client"

import { useState } from "react"
import { UploadZone } from "@/components/upload-zone"
import { PDFViewer } from "@/components/pdf-viewer"
import { HelpChat } from "@/components/help-chat"
import { SplitAnimation } from "@/components/split-animation"

interface PDFPage {
  pageNumber: number
  pdfBlob: Blob
}

export default function Home() {
  const [pages, setPages] = useState<PDFPage[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setPages([])
    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const { PDFDocument } = await import("pdf-lib")

      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const totalPages = pdfDoc.getPageCount()

      console.log(`[v0] Processing ${totalPages} pages...`)

      const extractedPages: PDFPage[] = []

      for (let i = 0; i < totalPages; i++) {
        const singlePagePdf = await PDFDocument.create()
        const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i])
        singlePagePdf.addPage(copiedPage)

        const pdfBytes = await singlePagePdf.save()
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" })

        extractedPages.push({
          pageNumber: i + 1,
          pdfBlob,
        })

        console.log(`[v0] Extracted page ${i + 1}`)
      }

      setPages(extractedPages)
      console.log(`[v0] Successfully extracted all ${totalPages} pages`)
    } catch (err) {
      console.error("[v0] PDF processing error:", err)
      setError(err instanceof Error ? err.message : "Failed to process PDF")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPages([])
    setFileName("")
    setError(null)
  }

  if (pages.length > 0) {
    return (
      <>
        <PDFViewer pages={pages} fileName={fileName} onReset={handleReset} />
        <HelpChat />
      </>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-blue-50 dark:from-background dark:via-background dark:to-background flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-4 text-balance">
            John's PDF Splitter
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-4">
            Split your PDF into individual pages and download them instantly
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
              <span>No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
              <span>Your PDF Never Leaves Your Machine</span>
            </div>
          </div>
          <SplitAnimation />
        </div>

        <UploadZone onUpload={handleUpload} loading={loading} error={error} />

        {error && (
          <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </div>
      <HelpChat />
    </main>
  )
}
