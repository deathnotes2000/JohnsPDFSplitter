"use client"

import { useState } from "react"
import { Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface PDFPage {
  pageNumber: number
  pdfBlob: Blob
}

interface PDFViewerProps {
  pages: PDFPage[]
  fileName: string
  onReset: () => void
}

const pageColors = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-blue-500",
]

export function PDFViewer({ pages, fileName, onReset }: PDFViewerProps) {
  const [downloading, setDownloading] = useState(false)

  const downloadPage = (pageNum: number) => {
    const page = pages.find((p) => p.pageNumber === pageNum)
    if (!page) return

    const url = window.URL.createObjectURL(page.pdfBlob)
    const a = document.createElement("a")
    a.href = url
    const baseName = fileName.replace(".pdf", "")
    a.download = `${baseName}_page_${pageNum}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const downloadAll = async () => {
    setDownloading(true)
    for (let i = 1; i <= pages.length; i++) {
      downloadPage(i)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    setDownloading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-blue-50 dark:from-background dark:via-background dark:to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent text-balance">
                {fileName.replace(".pdf", "")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {pages.length} page{pages.length !== 1 ? "s" : ""} split successfully
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={downloadAll} disabled={downloading} variant="default" className="gap-2">
                {downloading ? <Spinner size="sm" /> : <Download size={16} />}
                <span className="hidden sm:inline">{downloading ? "Downloading..." : "Download All"}</span>
              </Button>
              <Button onClick={onReset} disabled={downloading} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw size={16} />
                <span className="hidden sm:inline">New PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {pages.map((page) => {
            const colorIndex = (page.pageNumber - 1) % pageColors.length
            const gradient = pageColors[colorIndex]

            return (
              <div
                key={page.pageNumber}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Colorful document thumbnail */}
                <div className={`aspect-[8.5/11] bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  {/* Paper effect */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

                  {/* Document lines */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-4 gap-2">
                    <div className="w-full h-1.5 bg-white/40 rounded" />
                    <div className="w-3/4 h-1.5 bg-white/40 rounded" />
                    <div className="w-full h-1.5 bg-white/40 rounded" />
                    <div className="w-2/3 h-1.5 bg-white/40 rounded" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold drop-shadow-lg">Ready!</span>
                  </div>

                  {/* Page number badge */}
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm text-foreground text-xs font-bold px-2 py-1 rounded">
                    {page.pageNumber}
                  </div>
                </div>

                {/* Download button */}
                <div className="p-3">
                  <Button
                    onClick={() => downloadPage(page.pageNumber)}
                    disabled={downloading}
                    size="sm"
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Download size={14} />
                    Page {page.pageNumber}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
