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
            code: CodeRender,
            iframe: (props: any) => {
              const p = { ...props };
              // 1. Tipagem do React (Limpa os avisos do Turbopack)
              if (typeof p.allowFullScreen === 'string') p.allowFullScreen = p.allowFullScreen === 'true';
              if (typeof p.autoPlay === 'string') p.autoPlay = p.autoPlay === 'true';
              if (typeof p.loop === 'string') p.loop = p.loop === 'true';
              
              // 2. Firewall de Domínios Permitidos
              const allowedDomains = ['https://www.youtube.com/embed/', 'https://player.vimeo.com/video/'];
              const isTrusted = allowedDomains.some(domain => p.src?.startsWith(domain));
              
              if (!isTrusted) {
                return <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-sm text-xs font-mono my-4">
                  ⚠️ Conteúdo bloqueado por segurança: iFrame de domínio não autorizado.
                </div>;
              }
              
              return <iframe {...p} className="max-w-full rounded-sm shadow-sm my-4 aspect-video" />;
            },
            video: (props: any) => {
              const p = { ...props };
              if (typeof p.autoPlay === 'string') p.autoPlay = p.autoPlay === 'true';
              if (typeof p.loop === 'string') p.loop = p.loop === 'true';
              // Videos HTML5 normais são menos críticos para XSS do que iframes, mas ainda ajustamos a tipagem
              return <video {...p} className="max-w-full rounded-sm my-4" controls />;
            }
          }
        }}
      />
    </div>
  )
}

