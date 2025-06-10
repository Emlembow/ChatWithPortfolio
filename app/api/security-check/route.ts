import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "Security headers are being applied correctly",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        // These headers will be merged with those from middleware
        "X-Security-Check": "passed",
      },
    },
  )
}
