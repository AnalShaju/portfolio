export type ProjectIcon =
  | "Sparkles"
  | "Bot"
  | "UserRound"
  | "QrCode"
  | "Terminal"
  | "Globe2"

export type Project = {
  name: string
  description: string
  icon: ProjectIcon
  logo?: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  npmUrl?: string
  status?: string
}

/**
 * Local source of truth for projects.
 * Edit this file to add, reorder, or feature projects — no GitHub sync.
 */
export const projects: Project[] = [
  {
    name: "TextToViral",
    description:
      "Paste a rough thought. Get viral, funny, founder, and thread versions instantly.",
    icon: "Sparkles",
    logo: "/favicon_txt.ico",
    technologies: [],
    liveUrl: "https://www.texttoviral.xyz/",
  },
  {
    name: "Elio",
    description:
      "Telegram personal assistant — chat, remember context, and act through connected tools: Google Docs, Google Drive, Gmail, GitHub, plus Calendar/Tasks and web search.",
    icon: "Bot",
    logo: "/favicon_elio.ico",
    technologies: [],
    liveUrl: "https://www.heyelio.xyz/",
  },
  {
    name: "Sree Portfolio",
    description:
      "A personal portfolio website designed and built for a friend.",
    icon: "UserRound",
    technologies: [],
    liveUrl: "https://iamsreehari.vercel.app/",
  },
  {
    name: "Proof of Hunt",
    description:
      "A QR-based scavenger hunt built for a college tech event.",
    icon: "QrCode",
    technologies: [],
    liveUrl: "https://proofofhunt.vercel.app/",
    githubUrl: "https://github.com/AnalShaju/proofofhunt",
  },
  {
    name: "grabctx",
    description:
      "Convert webpages and PDFs into clean, token-efficient Markdown for AI models. Available as an npm package and terminal tool.",
    icon: "Terminal",
    technologies: ["Node.js", "TypeScript", "CLI", "AI"],
    githubUrl: "https://github.com/AnalShaju/grabctx",
    npmUrl: "https://www.npmjs.com/package/grabctx?activeTab=readme",
  },
  {
    name: "webcontext-mcp",
    description:
      "An MCP server that extracts the visual DNA from any website - colors, typography, spacing, layout, motion so Cursor, Claude Code, and more build UI that looks designed, not generated.",
    icon: "Globe2",
    technologies: ["TypeScript", "MCP", "AI"],
    githubUrl: "https://github.com/AnalShaju/webcontext-mcp",
    npmUrl: "https://www.npmjs.com/package/webcontext-mcp",
    status: "In progress",
  },
]
