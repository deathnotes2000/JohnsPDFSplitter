"use client"

import { useEffect, useRef } from "react"

interface PDFThumbnailProps {
  pdfData: string
}

export function PDFThumbnail({ pdfData }: PDFThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!pdfData || !canvasRef.current) return

    let isMounted = true

    const renderPDF = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist")

        // Set worker URL from CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        // Convert base64 to Uint8Array
        const binaryString = atob(pdfData)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        // Load PDF
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise
        const page = await pdf.getPage(1)

        // Calculate scale to fit canvas
        const canvas = canvasRef.current
        if (!canvas) return

        const viewport = page.getViewport({ scale: 1 })
        const scale = Math.min(canvas.clientWidth / viewport.width, canvas.clientHeight / viewport.height)
        const scaledViewport = page.getViewport({ scale })

        canvas.width = scaledViewport.width
        canvas.height = scaledViewport.height

        const context = canvas.getContext("2d")
        if (!context) return

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise

        pdf.destroy()
      } catch (error) {
        console.error("[v0] Error rendering PDF thumbnail:", error)
      }
    }

    renderPDF()

    return () => {
      isMounted = false
    }
  }, [pdfData])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
