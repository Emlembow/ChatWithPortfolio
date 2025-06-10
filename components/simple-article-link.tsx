"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function SimpleArticleLink() {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // Add a click event listener for debugging
    const link = linkRef.current
    if (link) {
      const handleClick = () => {
        console.log("Link clicked!")
        // Force navigation in case the default behavior is being prevented
        window.open(link.href, "_blank", "noopener,noreferrer")
      }

      link.addEventListener("click", handleClick)
      return () => link.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <a
      ref={linkRef}
      href="/blog/01-neural-interface-certification"
      onClick={() => console.log("onClick fired")}
      style={{
        display: "block",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        padding: "16px",
        margin: "-16px",
        borderRadius: "8px",
        transition: "background-color 0.2s, transform 0.2s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)"
        e.currentTarget.style.transform = "scale(1.01)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <div>
        <Image
          src="/software-dashboard.png"
          alt="Neural Interface Certification for Product Managers"
          width={800}
          height={400}
          className="rounded-lg border-2 border-slate-200/10 mb-6"
        />

        <h3 className="text-xl font-bold text-slate-200 mb-2">Neural Interface Certification: A PM&apos;s Guide</h3>

        <div className="text-sm text-slate-400 mb-4">January 2024 • Blog Post</div>

        <p className="text-slate-400">
          As product managers in the neural computing space, aligning our roadmap with Galactic Neural Safety Protocol requirements is critical for accessing Tier-7 civilization customers. Major certification standards define stringent security and operational standards...
        </p>

        <div className="mt-4 text-blue-500">Read Article →</div>
      </div>
    </a>
  )
}
