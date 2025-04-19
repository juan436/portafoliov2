import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { ContentProvider } from "@/contexts/content-context"
import WolfGuide from "@/components/wolf-guide"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Juan Villegas | Desarrollador Full Stack",
  description:
    "Portafolio profesional de Juan Villegas, desarrollador Full Stack especializado en Next.js, React, Node.js, Express, PHP y Laravel.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Add Devicon CSS */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-slate-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ContentProvider>
            <LanguageProvider>
              {children}
              <WolfGuide />
            </LanguageProvider>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"
