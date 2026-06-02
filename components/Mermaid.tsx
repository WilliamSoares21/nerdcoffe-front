"use client"

import React, { useEffect, useRef, useState, useId } from "react"
import mermaid from "mermaid"

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
  themeVariables: {
    background: "#181825",
    primaryColor: "#cba6f7",
    primaryTextColor: "#cdd6f4",
    lineColor: "#cba6f7",
  }
})

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const uniqueId = useId()
  const elementId = `mermaid-${uniqueId.replace(/:/g, "")}`
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(elementId, chart)
        if (isMounted) {
          setSvg(renderedSvg)
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Mermaid rendering error:", err)
          setError(err.message || String(err))
          
          const badElement = document.getElementById(elementId)
          if (badElement) {
            badElement.remove()
          }
        }
      }
    }

    renderChart()
    
    return () => {
      isMounted = false
    }
  }, [chart, elementId])

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive text-sm font-mono whitespace-pre-wrap">
        <p className="font-bold">Erro ao renderizar o diagrama Mermaid:</p>
        {error}
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="animate-pulse bg-[#181825] h-32 rounded-md flex items-center justify-center text-muted-foreground text-sm">
        Carregando diagrama...
      </div>
    )
  }

  return (
    <div 
      className="mermaid-svg flex justify-center py-4 bg-[#181825] rounded-md overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  )
}
