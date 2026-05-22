"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
    )
  }

  const isDark = (resolvedTheme || theme) === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-md text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-300 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={isDark}
    >
      <span className="sr-only">{isDark ? 'Enable light mode' : 'Enable dark mode'}</span>
      <Sun className={`absolute h-4 w-4 transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
      <Moon className={`absolute h-4 w-4 transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
    </button>
  )
}
