import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "Alex Quantum - Neural Systems Architect"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  try {
    // Use system fonts instead of trying to load external fonts
    return new ImageResponse(
      <div
        style={{
          background: "linear-gradient(to bottom, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          Alex Quantum
        </div>
        <div
          style={{
            fontSize: "36px",
            color: "#94a3b8",
            marginBottom: "40px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Neural Systems Architect
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#60a5fa",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "800px",
          }}
        >
          Interdimensional Systems Engineer with 8+ years of experience across Neural Computing, Quantum Architecture, Holographic Interfaces, and Temporal Database Design
        </div>
      </div>,
      {
        ...size,
      },
    )
  } catch (error) {
    console.error("Error generating Twitter image:", error)

    // Return a simpler fallback image
    return new ImageResponse(
      <div
        style={{
          background: "linear-gradient(to bottom, #0f172a, #1e293b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Alex Quantum
        </div>
        <div
          style={{
            fontSize: "36px",
            color: "#94a3b8",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          Neural Systems Architect
        </div>
      </div>,
      {
        ...size,
      },
    )
  }
}
