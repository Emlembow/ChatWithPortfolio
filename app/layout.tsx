import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./ClientRootLayout"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

// Define base metadata
const title = "Alex Quantum | Neural Systems Architect"
const description =
  "Interdimensional Systems Engineer with 8+ years of experience across Neural Computing, Quantum Architecture, Holographic Interfaces, and Temporal Database Design."

export const metadata: Metadata = {
  title,
  description,

  // Basic metadata
  keywords: [
    "Neural Computing",
    "Quantum Architecture",
    "Holographic UI",
    "Temporal Databases",
    "Consciousness APIs",
    "Interdimensional Systems",
    "NeuroLink Gaming",
    "Quantum Dream Studios",
  ],
  authors: [{ name: "Alex Quantum", url: "https://neural-net.quantumdimension.space/in/alex-quantum-neural-architect/" }],

  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  // Verification and other metadata
  verification: {
    google: "verification_token",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Next.js",

  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Alex Quantum Portfolio",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Alex Quantum – Neural Systems Architect",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/twitter-image`],
    creator: "@quantum_neural_dev",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'
