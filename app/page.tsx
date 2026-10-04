import { HeroHeading } from "@/components/hero-heading";
import { HeroPortrait } from "@/components/hero-portrait";
import { PhotoBanner } from "@/components/photo-banner";
import { ProjectsSection } from "@/components/projects/projects-section";
import { QuoteSection } from "@/components/quote-section";
import { SectionRule, SiteFrame } from "@/components/site-frame";
import { SectionChip, Tag } from "@/components/tag";
import { site } from "@/lib/content";

export default function Home() {
  return (
    <div className="min-h-full px-3 pb-28 sm:px-6">
      <SiteFrame>
        <div className="p-4 sm:p-6">
          <PhotoBanner />
        </div>
        <SectionRule />

        <main className="flex flex-1 flex-col">
          <section id="home" className="scroll-mt-8 px-4 py-12 sm:px-6 sm:py-16">
            <div
              id="about"
              className="scroll-mt-8 flex w-full max-w-[40rem] flex-col items-start gap-5 sm:flex-row sm:items-start sm:gap-8"
            >
              <div className="shrink-0 sm:mt-1">
                <HeroPortrait />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <HeroHeading />
                <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                  {site.bio}
                </p>
              </div>
            </div>
          </section>

          <SectionRule />

          <section
            id="experience"
            aria-labelledby="experience-heading"
            className="scroll-mt-8 px-4 py-8 sm:px-6 sm:py-10"
          >
            <SectionChip id="experience-heading">Experience</SectionChip>
            <div className="mt-5 max-w-[40rem]">
              <h3 className="text-[1.0625rem] font-semibold tracking-tight text-foreground sm:text-[1.125rem]">
                {site.experience.title}
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                {site.experience.description}
              </p>
            </div>
          </section>

          <SectionRule />

          <ProjectsSection />

          <SectionRule />

          <section
            id="more"
            aria-labelledby="stack-heading"
            className="scroll-mt-8 px-4 py-8 sm:px-6 sm:py-10"
          >
            <SectionChip id="stack-heading">What I work with</SectionChip>
            <div className="flex flex-wrap gap-1.5">
              {site.techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
              {site.pastProjects}
            </p>
          </section>

          <SectionRule />

          <div className="px-4 py-8 sm:px-6 sm:py-10">
            <QuoteSection />
          </div>
        </main>

        <SectionRule />

        <footer className="flex items-start justify-between gap-6 px-4 py-5 text-[13px] text-muted-foreground sm:px-6">
          <span>{site.location}</span>
          <span className="text-right">{site.tagline}</span>
        </footer>
      </SiteFrame>
    </div>
  );
}
