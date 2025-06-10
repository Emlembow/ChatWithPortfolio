"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that use window/document with ssr: false
const ChatWidget = dynamic(() => import("@/components/chat/ChatWidget"), { ssr: false })
const SplitLayout = dynamic(() => import("@/components/SplitLayout"), { ssr: false })

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <SplitLayout chat={<ChatWidget />} main={children} />
}
