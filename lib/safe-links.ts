import type React from "react"
/**
 * Utility to check if a URL is external
 * @param url The URL to check
 * @returns boolean indicating if the URL is external
 */
export function isExternalUrl(url: string): boolean {
  // If the URL starts with http:// or https:// and doesn't contain the current hostname
  if (!url) return false

  // Handle relative URLs
  if (url.startsWith("/") || url.startsWith("#")) return false

  try {
    // For absolute URLs, check if they're external
    const urlObj = new URL(url, window.location.origin)
    return urlObj.hostname !== window.location.hostname
  } catch (e) {
    // If URL parsing fails, assume it's not external
    return false
  }
}

/**
 * Utility to ensure external links have proper security attributes
 * @param props The props for an anchor tag
 * @returns The props with security attributes added if needed
 */
export function getSafeLinkProps(props: {
  href?: string
  target?: string
  rel?: string
  [key: string]: any
}): {
  href?: string
  target?: string
  rel: string
  [key: string]: any
} {
  const { href, target, rel, ...rest } = props

  // If it's an external link or opens in a new tab
  if ((href && isExternalUrl(href)) || target === "_blank") {
    // Ensure rel includes noopener and noreferrer
    const relValues = rel ? rel.split(" ") : []
    if (!relValues.includes("noopener")) relValues.push("noopener")
    if (!relValues.includes("noreferrer")) relValues.push("noreferrer")

    return {
      href,
      target,
      rel: relValues.join(" "),
      ...rest,
    }
  }

  // For internal links, return props as is
  return { href, target, rel: rel || "", ...rest }
}

