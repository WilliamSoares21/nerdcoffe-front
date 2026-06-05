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
        }}
      />
    </div>
  )
}
