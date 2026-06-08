"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Initialize input state with query param if present
  const [value, setValue] = useState(searchParams.get("q") || "")

  useEffect(() => {
    // Sync input value with searchParams when page changes
    setValue(searchParams.get("q") || "")
  }, [searchParams])

  useEffect(() => {
    // Debounce logic
    const handler = setTimeout(() => {
      const trimmed = value.trim()
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      } else {
        // If the input is cleared and we are currently on the search results page, redirect back to feed
        if (pathname === "/search") {
          router.push("/feed")
        }
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [value, router, pathname])

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="search"
        placeholder="Pesquisar artigos..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 text-xs bg-muted/40 placeholder:text-muted-foreground/50 border border-border/80 focus:border-coffee transition-colors focus:ring-1 focus:ring-coffee/30"
      />
    </div>
  )
}
