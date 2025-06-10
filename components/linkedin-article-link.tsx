"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"

export default function LinkedInArticleLink() {
  return (
    <a
      href="/blog/01-neural-interface-certification"
      className="block cursor-pointer rounded-lg transition-all hover:bg-slate-800/50 hover:shadow-lg p-4 -m-4"
    >
      <Image
        src="/software-dashboard.png"
        alt="Neural Interface Certification for Product Managers"
        width={800}
        height={400}
        className="rounded-lg border-2 border-slate-200/10 transition hover:border-slate-200/30 mb-6"
      />

      <h3 className="text-xl font-bold text-slate-200 mb-2 hover:text-blue-500">Neural Interface Certification: A PM's Guide</h3>

      <div className="text-sm text-slate-400 mb-4">January 2024 • Blog Post</div>

      <p className="text-slate-400">
        As product managers in the neural computing space, aligning our roadmap with Galactic Neural Safety Protocol requirements is critical for accessing Tier-7 civilization customers. Major certification standards define stringent security and operational standards...
      </p>

      <div className="mt-4 inline-flex items-center text-blue-500">
        Read Article
        <ExternalLink className="ml-1 h-4 w-4 shrink-0" />
      </div>
    </a>
  )
}
