"use client"

import { useEffect, useState } from "react"
import { FileText } from "lucide-react"

export function SplitAnimation() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 3)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center gap-8 py-8">
      {/* Main file icon */}
      <div
        className={`transition-all duration-500 ${
          stage === 0 ? "scale-100 opacity-100" : "scale-75 opacity-50 -translate-x-4"
        }`}
      >
        <div className="relative">
          <FileText size={48} className="text-violet-600" />
          {stage === 1 && (
            <div className="absolute inset-0 animate-ping">
              <FileText size={48} className="text-violet-400 opacity-30" />
            </div>
          )}
        </div>
      </div>

      {/* Arrow/splitting effect */}
      <div className="flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded transition-all duration-500 ${
              stage === 1 ? "w-8" : stage === 2 ? "w-12" : "w-0"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Split pages */}
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${
              stage === 2
                ? "translate-x-0 opacity-100"
                : stage === 1
                  ? "translate-x-4 opacity-50"
                  : "translate-x-0 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <FileText size={24} className="text-blue-600" />
          </div>
        ))}
      </div>
    </div>
  )
}
