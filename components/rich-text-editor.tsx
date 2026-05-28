"use client"

import React, { useRef, useEffect } from "react"
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  Code, 
  Quote, 
  Sparkles
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isUpdatingRef = useRef(false)

  // Sync internal HTML with value prop from parent
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      isUpdatingRef.current = true
      editorRef.current.innerHTML = value || ""
      isUpdatingRef.current = false
    }
  }, [value])

  const handleInput = () => {
    if (isUpdatingRef.current) return
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      // If it's just empty tags or break, treat as empty
      if (html === "<br>" || html === "<p><br></p>" || html === "") {
        onChange("")
      } else {
        onChange(html)
      }
    }
  }

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value)
    handleInput()
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Custom function for code block to insert structured HTML
  const insertCodeBlock = () => {
    const selection = window.getSelection()?.toString() || "código_aqui"
    const codeBlockHtml = `<pre class="bg-secondary/80 p-3 rounded-sm font-mono text-sm my-4 border border-border overflow-x-auto block"><code>${selection}</code></pre>`
    execCommand("insertHTML", codeBlockHtml)
  }

  return (
    <div className="border border-border rounded-sm bg-input overflow-hidden focus-within:ring-1 focus-within:ring-coffee focus-within:border-coffee transition-shadow">
      {/* Sleek minimalist toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 bg-secondary/20 px-3 py-2 border-b border-border select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors cursor-pointer"
            title="Negrito (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors cursor-pointer"
            title="Itálico (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <div className="w-[1px] h-4 bg-border mx-1" />

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h1>")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors font-mono font-bold text-xs cursor-pointer"
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<h2>")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors font-mono font-bold text-xs cursor-pointer"
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>

          <div className="w-[1px] h-4 bg-border mx-1" />

          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors cursor-pointer"
            title="Lista com Marcadores"
          >
            <List className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("formatBlock", "<blockquote>")}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors cursor-pointer"
            title="Citação"
          >
            <Quote className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={insertCodeBlock}
            className="p-2 text-muted-foreground hover:text-coffee hover:bg-secondary rounded-sm transition-colors cursor-pointer"
            title="Bloco de Código"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-mono pr-1">
          <Sparkles className="h-3.5 w-3.5 text-coffee animate-pulse" />
          <span>Editor Visual</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder || "Escreva o conteúdo do seu artigo aqui..."}
        className="w-full min-h-[380px] p-5 focus:outline-none text-foreground text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none overflow-y-auto select-text empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 empty:before:pointer-events-none empty:before:block"
      />
    </div>
  )
}
