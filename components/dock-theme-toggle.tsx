"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** Theme switch for the floating Dock — not a nav link, no scroll-spy active state. */
export function DockThemeToggle({
  className,
  iconClassName,
}: {
  className?: string
  iconClassName?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={
        !mounted
          ? "Toggle theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      title={!mounted ? "Theme" : isDark ? "Light mode" : "Dark mode"}
      onClick={() => {
        if (!mounted) return
        setTheme(isDark ? "light" : "dark")
      }}
      className={cn(
        "absolute inset-0 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {!mounted ? (
        <Moon className={cn("size-4 opacity-0", iconClassName)} aria-hidden />
      ) : isDark ? (
        <Sun className={cn("size-4", iconClassName)} />
      ) : (
        <Moon className={cn("size-4", iconClassName)} />
      )}
    </button>
  )
}
