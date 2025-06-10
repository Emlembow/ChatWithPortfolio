"use client"

import type React from "react"
import { useEffect } from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "@/components/ClientLayout"
import { initCspReporting } from "@/lib/csp-report"
import { checkAllLinks } from "@/lib/link-checker"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize CSP reporting and check links
  useEffect(() => {
    initCspReporting()

    // Check all links in development mode
    if (process.env.NODE_ENV === "development") {
      checkAllLinks()
    }
  }, [])

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-900 leading-relaxed text-slate-400 antialiased selection:bg-teal-300 selection:text-teal-900`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}