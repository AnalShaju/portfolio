import { ProjectCard } from "@/components/projects/project-card"
import { projects } from "@/data/projects"

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-8 px-4 py-8 sm:px-6 sm:py-10"
    >
      <h2
        id="projects-heading"
        className="mb-2 text-[1.125rem] font-semibold tracking-tight text-foreground sm:text-[1.25rem]"
      >
        Things I&apos;ve built
      </h2>

      <p className="mb-6 max-w-[48ch] text-[14px] leading-relaxed text-muted-foreground">
        A collection of projects, experiments, and tools I&apos;ve built while
        learning.
      </p>

      {projects.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {projects.map((project) => (
            <li key={project.name}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}

      <aside
        aria-label="Beyond the projects"
        className="mt-8 flex w-full items-start gap-3.5 border-t border-dashed border-black/10 pt-7 dark:border-white/[0.1]"
      >
        <span
          aria-hidden
          className="note-glass-mark mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-medium text-foreground/70"
        >
          #
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-medium tracking-tight text-foreground">
            Beyond the projects
          </h3>
          <p className="mt-1 max-w-[52ch] text-[13px] leading-relaxed text-muted-foreground">
            More experiments, hackathon builds, and things I&apos;ve explored
            along the way.
          </p>
        </div>
      </aside>
    </section>
  )
}
