/**
 * Utility to check all links in the application for security attributes
 * This function should be called in development mode only
 */
export function checkAllLinks() {
  if (typeof document === "undefined" || process.env.NODE_ENV !== "development") return

  // Wait for the DOM to be fully loaded
  setTimeout(() => {
    const links = document.querySelectorAll('a[target="_blank"]')
    const insecureLinks: HTMLAnchorElement[] = []

    links.forEach((link) => {
      const rel = link.getAttribute("rel") || ""
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        insecureLinks.push(link as HTMLAnchorElement)
      }
    })

    if (insecureLinks.length > 0) {
      console.warn(
        `Found ${insecureLinks.length} insecure external links without rel="noopener noreferrer":`,
        insecureLinks,
      )
    } else {
      console.info("All external links have proper security attributes.")
    }
  }, 2000) // Wait 2 seconds for the DOM to be fully loaded
}
