"use client"

import React from "react"
import MarkdownPreview from "@uiw/react-markdown-preview"
import Mermaid from "./Mermaid"

interface MarkdownRendererProps {
  content: string
}

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

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div data-color-mode="dark">
      <MarkdownPreview 
        source={content} 
        style={{ backgroundColor: 'transparent' }} 
        components={{
          code: CodeRender
        }}
      />
    </div>
  )
}
