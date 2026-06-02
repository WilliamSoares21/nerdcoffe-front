"use client"

import React from "react"
import dynamic from "next/dynamic"

import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import Mermaid from "./Mermaid"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
)

const getCodeString = (children: any): string => {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(getCodeString).join("")
  if (typeof children === "object" && children?.props?.children) {
    return getCodeString(children.props.children)
  }
  return ""
}

const CodeRender = ({ inline, className, children, ...props }: any) => {
  const match = /language-mermaid/.exec(className || "")
  if (!inline && match) {
    const codeString = getCodeString(children).replace(/\n$/, "")
    return <Mermaid chart={codeString} />
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

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
        previewOptions={{
          components: {
            code: CodeRender
          }
        }}
      />
    </div>
  )
}

