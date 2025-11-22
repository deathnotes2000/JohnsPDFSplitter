"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const knowledgeBase: Record<string, string> = {
  "how does it work":
    "PDF Splitz is simple to use! Just drag and drop a PDF file onto the upload zone, and we'll automatically split it into individual pages. Each page will appear as a colorful thumbnail with a download button.",
  upload:
    "To upload a PDF, simply drag and drop your file onto the upload zone, or click to browse and select a file from your device. We support all standard PDF files.",
  download:
    "To download a page, click the 'Download' button below any page thumbnail. You can also download all pages at once using the 'Download All Pages' button at the top of the page.",
  pages:
    "After uploading, your PDF will be split into individual pages. Each page is shown as a colorful thumbnail marked 'Ready!' - click the download button below any thumbnail to save that specific page.",
  "file types": "We currently support PDF files only. Make sure your file has a .pdf extension.",
  reset:
    "To upload a new PDF, click the 'Upload New PDF' button at the top of the page. This will reset the app and take you back to the upload screen.",
  free: "Yes! PDF Splitz is completely free to use. There are no limits on the number of files or pages you can process.",
  privacy:
    "Your PDF files are processed entirely in your browser. We don't store or upload your files to any server - everything happens on your device for maximum privacy and security.",
}

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  // Check for greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm here to help you with PDF Splitz. You can ask me about how to upload files, download pages, or any other questions about using the app."
  }

  // Check knowledge base
  for (const [key, response] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }

  // Default response
  return "I can help you with questions about PDF Splitz! Try asking about:\n\n• How to upload a PDF\n• How to download pages\n• File types supported\n• Privacy and security\n• How the app works"
}

export function HelpChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your PDF Splitz assistant. Ask me anything about how to use the app!",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    const botResponse: Message = {
      role: "assistant",
      content: getBotResponse(input),
    }

    setMessages((prev) => [...prev, userMessage, botResponse])
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">PDF Splitz Help</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-line ${
                    message.role === "user" ? "bg-violet-600 text-white" : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
