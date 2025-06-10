"use client"

import React from "react"
import { getSafeLinkProps } from "@/lib/safe-links"

/**
 * SafeLink component that automatically adds security attributes to external links
 * Use this component instead of <a> for all links in the application
 */
const SafeLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ children, ...props }, ref) => {
    const safeProps = getSafeLinkProps(props)

    return (
      <a ref={ref} {...safeProps}>
        {children}
      </a>
    )
  },
)

SafeLink.displayName = "SafeLink"

export { SafeLink }
