"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className="absolute inset-0 h-6 w-6 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-blue-600" 
        />
        <Moon 
          className="absolute inset-0 h-6 w-6 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-amber-500" 
        />
      </div>
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 dark:group-hover:bg-amber-500/5 transition-colors" />
    </button>
  )
}
