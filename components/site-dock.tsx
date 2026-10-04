"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { HomeIcon, MailIcon } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { DockThemeToggle } from "@/components/dock-theme-toggle"
import { Dock, DockIcon } from "@/components/ui/dock"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

type IconProps = React.SVGProps<SVGSVGElement>

function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

const iconClass = "size-[22px] md:size-[18px]"
const slotClass = "size-11 md:size-10"

const SECTION_IDS = ["home", "experience", "projects", "more"]

const items = [
  { href: "#home", label: "Home", icon: HomeIcon, external: false, section: "home" },
  {
    href: site.social.github,
    label: "GitHub",
    icon: GitHubIcon,
    external: true,
  },
  {
    href: site.social.linkedin,
    label: "LinkedIn",
    icon: LinkedInIcon,
    external: true,
  },
  { href: site.social.x, label: "X", icon: XIcon, external: true },
  { href: site.social.email, label: "Mail", icon: MailIcon, external: true },
] as const

type PointerKind = "unknown" | "fine" | "coarse"

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)"

function subscribePointer(onChange: () => void) {
  const mq = window.matchMedia(FINE_POINTER_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

function usePointerKind(): PointerKind {
  return useSyncExternalStore<PointerKind>(
    subscribePointer,
    () => (window.matchMedia(FINE_POINTER_QUERY).matches ? "fine" : "coarse"),
    () => "unknown"
  )
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return

    const atTop = () => window.scrollY < 80

    const observer = new IntersectionObserver(
      (entries) => {
        if (atTop()) return setActive(ids[0])
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    els.forEach((el) => observer.observe(el))

    const onScroll = () => {
      if (atTop()) setActive(ids[0])
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [ids])

  return active
}

export function SiteDock() {
  const reduceMotion = useReducedMotion()
  const pointer = usePointerKind()
  const activeSection = useActiveSection(SECTION_IDS)
  const interactive = reduceMotion !== true

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <svg aria-hidden width="0" height="0" className="absolute">
        <filter
          id="dock-refraction"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves={1}
            seed={4}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <Dock
        interactive={interactive}
        pressable={interactive && pointer === "fine"}
        className="pointer-events-auto h-16 w-[calc(100vw-24px)] max-w-[22rem] justify-between px-2.5 sm:max-w-[21rem] md:h-14 md:w-max md:max-w-none md:justify-start md:gap-1.5 md:px-2"
      >
        {items.map((item) => {
          const Icon = item.icon
          const linkClass = cn(
            "absolute inset-0 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )
          const isActive =
            "section" in item && item.section === activeSection

          return (
            <DockIcon key={item.label} active={isActive} className={slotClass}>
              {item.external ? (
                <a
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    item.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  draggable={false}
                  className={linkClass}
                >
                  <Icon className={iconClass} />
                </a>
              ) : (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                  title={item.label}
                  draggable={false}
                  className={linkClass}
                >
                  <Icon className={iconClass} />
                </Link>
              )}
            </DockIcon>
          )
        })}

        <DockIcon className={slotClass}>
          <DockThemeToggle iconClassName={iconClass} />
        </DockIcon>
      </Dock>
    </nav>
  )
}
