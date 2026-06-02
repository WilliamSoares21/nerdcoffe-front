"use client"

import React from "react"
import dynamic from "next/dynamic"

// Import styles required by @uiw/react-md-editor
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div data-color-mode="dark" className="w-full">
      <MDEditor
        value={value || ""}
        onChange={(val) => onChange(val || "")}
        preview="live"
        height={400}
        textareaProps={{
          placeholder: placeholder || "Escreva o conteúdo do seu artigo aqui em Markdown...",
        }}
      />
    </div>
  )
}
