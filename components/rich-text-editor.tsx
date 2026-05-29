"use client"

import React, { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
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
  Sparkles
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
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
        placeholder: placeholder || "Escreva o conteúdo do seu artigo aqui... Selecione o texto para formatação.",
        emptyNodeClass: "is-placeholder",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "w-full min-h-[380px] p-5 focus:outline-none text-foreground text-base leading-relaxed prose prose-neutral dark:prose-invert max-w-none overflow-y-auto select-text",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (html === "<p></p>" || html === "") {
        onChange("")
      } else {
        onChange(html)
      }
    },
  })

  // Sync editor content with external state (e.g., React Hook Form)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="relative border border-border rounded-sm bg-input overflow-hidden focus-within:ring-1 focus-within:ring-coffee focus-within:border-coffee transition-shadow">
      
      {/* Bubble Menu (Formatação de Texto Selecionado) */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 bg-popover border border-border p-1.5 rounded-sm shadow-md animate-in fade-in-50 zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer ${
            editor.isActive("bold") ? "text-coffee bg-secondary font-bold" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer ${
            editor.isActive("italic") ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-[1px] h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer ${
            editor.isActive("heading", { level: 1 }) ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="H1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="H2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
      </BubbleMenu>

      {/* Floating Menu (Formatação de Blocos em Linhas Vazias) */}
      <FloatingMenu
        editor={editor}
        className="flex items-center gap-1.5 bg-popover/95 backdrop-blur-xs border border-border p-1.5 rounded-sm shadow-lg animate-in fade-in-50 zoom-in-95 duration-150"
      >
        <div className="px-2 py-0.5 text-[10px] font-mono uppercase text-muted-foreground border-r border-border/80 mr-0.5 select-none">
          Inserir
        </div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 ${
            editor.isActive("heading", { level: 1 }) ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 ${
            editor.isActive("heading", { level: 2 }) ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 ${
            editor.isActive("bulletList") ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Lista de Tópicos"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 ${
            editor.isActive("blockquote") ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-sm transition-all hover:bg-secondary cursor-pointer hover:scale-105 active:scale-95 ${
            editor.isActive("codeBlock") ? "text-coffee bg-secondary" : "text-muted-foreground hover:text-foreground"
          }`}
          title="Bloco de Código"
        >
          <Code className="h-4 w-4" />
        </button>
      </FloatingMenu>

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/10 border-t border-border/80 select-none">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-coffee" />
          <span>Notion-style Editor (Select text or click an empty line)</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 font-mono">
          <span>Block-based Markdown Support</span>
        </div>
      </div>
    </div>
  )
}
