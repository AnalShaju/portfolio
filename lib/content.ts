export type Tag = string

/** Edit these values — they drive the whole site. */
export const site = {
  name: "Anal Shaju",
  shortName: "AS",
  role: "student developer",
  headline: "Hey, I'm Anal Shaju. I build things.",
  bio: "Student developer. Builder of side projects. Currently figuring out what's worth building.",
  location: "India",
  tagline: "Still shipping.",
  resumeHref: "#",
  techStack: [
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "Python",
    "Postgres",
    "Tailwind CSS",
  ],
  pastProjects:
    "Always learning — exploring new tools, technologies, and better ways to build.",
  social: {
    github: "https://github.com/AnalShaju",
    linkedin: "https://www.linkedin.com/in/anal-shaju",
    x: "https://x.com/analshaju_",
    email: "mailto:analshajuwork404@gmail.com",
  },
  experience: {
    title: "Independent Developer",
    description:
      "Building and shipping small products, experiments, and tools. I learn by making things, talking to users, and figuring out what is worth building.",
  },
} as const
