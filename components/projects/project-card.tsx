import Image from "next/image"
import {
  ArrowUpRight,
  Bot,
  Globe2,
  QrCode,
  Sparkles,
  Terminal,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import type { Project, ProjectIcon } from "@/data/projects"
import { cn } from "@/lib/utils"

const PROJECT_ICONS: Record<ProjectIcon, LucideIcon> = {
  Sparkles,
  Bot,
  UserRound,
  QrCode,
  Terminal,
  Globe2,
}

function ProjectIconBox({
  icon,
  logo,
}: {
  icon: ProjectIcon
  logo?: string
}) {
  if (logo) {
  return (
    <span
      aria-hidden
      className="project-icon-box flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border"
    >
        <Image
          src={logo}
          alt=""
          width={32}
          height={32}
          sizes="32px"
          unoptimized={logo.endsWith(".ico")}
          className="size-full object-contain p-1"
        />
    </span>
  )
  }

  const Icon = PROJECT_ICONS[icon]

  return (
    <span
      aria-hidden
      className="project-icon-box flex size-8 shrink-0 items-center justify-center rounded-md border text-muted-foreground"
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </span>
  )
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex items-center gap-0.5 text-[12px] text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      <ArrowUpRight className="size-3 opacity-70" aria-hidden />
    </a>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const primaryHref = project.liveUrl ?? project.githubUrl ?? project.npmUrl
  const tech = project.technologies.slice(0, 4)

  return (
    <article
      className={cn(
        "project-card group relative rounded-lg border",
        "px-4 py-4 transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out",
        "hover:-translate-y-px"
      )}
    >
      {primaryHref ? (
        <a
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Open ${project.name}`}
        />
      ) : null}

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 gap-3.5">
          <ProjectIconBox icon={project.icon} logo={project.logo} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-[16px] font-medium tracking-tight text-foreground sm:text-[17px]">
                {project.name}
              </h3>
              {project.status ? (
                <span className="section-glass relative inline-flex items-center overflow-hidden rounded-full px-2 py-0.5 text-[10px] font-medium tracking-tight text-muted-foreground">
                  <span aria-hidden className="section-glass-base" />
                  <span className="relative z-10">{project.status}</span>
                </span>
              ) : null}
            </div>
            <p className="mt-1 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
              {project.description}
            </p>
            {tech.length > 0 ? (
              <p className="mt-2.5 text-[11px] leading-relaxed tracking-wide text-muted-foreground/80 sm:text-[12px]">
                {tech.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 pl-11 sm:pl-0 sm:pt-0.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {project.liveUrl ? (
              <ExternalTextLink href={project.liveUrl}>Live</ExternalTextLink>
            ) : null}
            {project.githubUrl ? (
              <ExternalTextLink href={project.githubUrl}>GitHub</ExternalTextLink>
            ) : null}
            {project.npmUrl ? (
              <ExternalTextLink href={project.npmUrl}>npm</ExternalTextLink>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
