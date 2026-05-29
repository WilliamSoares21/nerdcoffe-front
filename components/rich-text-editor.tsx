"use client"

import React, { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  Code, 
  Quote, 
  Sparkles,
  CornerDownLeft
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const COMMANDS = [
  { id: "h1", label: "Título 1", description: "Cabeçalho grande", icon: Heading1 },
  { id: "h2", label: "Título 2", description: "Cabeçalho médio", icon: Heading2 },
  { id: "bulletList", label: "Lista de Tópicos", description: "Criar uma lista simples", icon: List },
  { id: "quote", label: "Citação", description: "Inserir bloco de citação", icon: Quote },
  { id: "codeBlock", label: "Bloco de Código", description: "Escrever trecho de código", icon: Code },
]

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 })
  
  // Selection/Bubble Menu state
  const [bubbleMenuOpen, setBubbleMenuOpen] = useState(false)
  const [bubbleCoords, setBubbleCoords] = useState({ top: 0, left: 0 })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-secondary/85 p-4 rounded-sm font-mono text-sm my-4 border border-border overflow-x-auto block",
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escreva o conteúdo do seu artigo aqui... Digite '/' para comandos.",
        emptyNodeClass: "is-placeholder",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "w-full min-h-[380px] p-5 focus:outline-none text-foreground text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none overflow-y-auto select-text",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "/") {
          const { selection } = view.state
          const coords = view.coordsAtPos(selection.from)
          setMenuCoords({
            top: coords.bottom + window.scrollY,
            left: coords.left + window.scrollX,
          })
          setSlashMenuOpen(true)
          setSelectedIndex(0)
        }

        if (slashMenuOpen) {
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setSelectedIndex(prev => (prev + 1) % COMMANDS.length)
            return true
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setSelectedIndex(prev => (prev - 1 + COMMANDS.length) % COMMANDS.length)
            return true
          }
          if (event.key === "Enter") {
            event.preventDefault()
            executeCommand(COMMANDS[selectedIndex].id)
            return true
          }
          if (event.key === "Escape" || event.key === "Backspace") {
            setSlashMenuOpen(false)
            if (event.key === "Escape") {
              return true
            }
          }
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (html === "<p></p>" || html === "") {
        onChange("")
      } else {
        onChange(html)
      }

      // Hide slash menu if trigger '/' is deleted
      const { selection } = editor.state
      const textAround = editor.state.doc.textBetween(Math.max(0, selection.from - 1), selection.from)
      if (textAround !== "/") {
        setSlashMenuOpen(false)
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      
      // Show formatting bubble menu only if text is actually selected
      if (from !== to) {
        try {
          const coords = editor.view.coordsAtPos(from)
          setBubbleCoords({
            top: coords.top + window.scrollY - 48, // slightly above the text
            left: Math.max(10, coords.left + window.scrollX - 60),
          })
          setBubbleMenuOpen(true)
        } catch (e) {
          setBubbleMenuOpen(false)
        }
      } else {
        setBubbleMenuOpen(false)
      }
    }
  })

  // Sync editor content with React Hook Form
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  const executeCommand = (id: string) => {
    if (!editor) return

    // Delete the "/" trigger character
    const { selection } = editor.state
    editor.chain().focus().deleteRange({ from: selection.from - 1, to: selection.from }).run()

    switch (id) {
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case "bulletList":
        editor.chain().focus().toggleBulletList().run()
        break
      case "quote":
        editor.chain().focus().toggleBlockquote().run()
        break
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run()
        break
    }
    setSlashMenuOpen(false)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setSlashMenuOpen(false)
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  if (!editor) return null

  return (
    <div className="relative border border-border rounded-sm bg-input overflow-hidden focus-within:ring-1 focus-within:ring-coffee focus-within:border-coffee transition-shadow">
      
      {/* Selection/Bubble Formatting Menu (Pure React + Absolutes) */}
      {bubbleMenuOpen && (
        <div
          className="absolute z-50 flex items-center gap-0.5 bg-popover border border-border p-1 rounded shadow-md"
          style={{
            top: `${bubbleCoords.top - 80}px`,
            left: `${bubbleCoords.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-sm transition-colors hover:bg-secondary cursor-pointer ${
              editor.isActive("bold") ? "text-coffee bg-secondary" : "text-muted-foreground"
            }`}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-sm transition-colors hover:bg-secondary cursor-pointer ${
              editor.isActive("italic") ? "text-coffee bg-secondary" : "text-muted-foreground"
            }`}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded-sm transition-colors hover:bg-secondary cursor-pointer ${
              editor.isActive("heading", { level: 1 }) ? "text-coffee bg-secondary" : "text-muted-foreground"
            }`}
            title="H1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-sm transition-colors hover:bg-secondary cursor-pointer ${
              editor.isActive("heading", { level: 2 }) ? "text-coffee bg-secondary" : "text-muted-foreground"
            }`}
            title="H2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/10 border-t border-border/80 select-none">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-coffee" />
          <span>Notion-style Editor (Type &apos;/&apos; or select text)</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
          <span>Block-based Markdown Support</span>
        </div>
      </div>

      {/* Floating Slash Commands Menu */}
      {slashMenuOpen && (
        <div
          className="absolute z-50 bg-popover border border-border rounded-sm shadow-lg max-w-[280px] w-64 overflow-hidden py-1 divide-y divide-border/40"
          style={{
            top: `${menuCoords.top - 80}px`,
            left: `${menuCoords.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 bg-secondary/30 text-[10px] font-mono uppercase text-muted-foreground flex items-center justify-between">
            <span>Comandos em Bloco</span>
            <span className="flex items-center gap-0.5">
              <CornerDownLeft className="h-2.5 w-2.5" /> Enter
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {COMMANDS.map((cmd, idx) => {
              const Icon = cmd.icon
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => executeCommand(cmd.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                    idx === selectedIndex ? "bg-coffee/10 text-coffee" : "hover:bg-secondary/60 text-foreground"
                  }`}
                >
                  <div className={`p-1.5 rounded-sm ${idx === selectedIndex ? "bg-coffee/20 text-coffee" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{cmd.label}</div>
                    <div className="text-[10px] text-muted-foreground/80 line-clamp-1">{cmd.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
