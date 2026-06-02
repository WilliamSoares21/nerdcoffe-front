"use client"

import React from "react"
import MarkdownPreview from "@uiw/react-markdown-preview"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div data-color-mode="dark">
      <MarkdownPreview source={content} style={{ backgroundColor: 'transparent' }} />
    </div>
  )
}
