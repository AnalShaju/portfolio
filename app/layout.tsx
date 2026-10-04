import type { Metadata } from "next"
import { Public_Sans } from "next/font/google"

import { SiteDock } from "@/components/site-dock"
import { ThemeProvider } from "@/components/theme-provider"
import { site } from "@/lib/content"

import "./globals.css"

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${site.name} — Portfolio`,
  description: `Hey, I'm ${site.name} — ${site.role}.`,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <SiteDock />
        </ThemeProvider>
      </body>
    </html>
  )
}
