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
      <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] animate-pulse" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-[10px] bg-[#FAFAF8] dark:bg-[#1e1e24] border-[1.5px] border-[#E8E8E4] dark:border-[#2a2a32] hover:border-[#5CC67A] dark:hover:border-[#5CC67A] hover:bg-[#E8F8ED] dark:hover:bg-[#1e293b] transition-all duration-200 group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="h-[18px] w-[18px] text-[#94a3b8] group-hover:text-[#5CC67A] transition-colors duration-200" />
      ) : (
        <Sun className="h-[18px] w-[18px] text-[#6B7068] group-hover:text-[#FF8C47] transition-colors duration-200" />
      )}
    </button>
  )
}
