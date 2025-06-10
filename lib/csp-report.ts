/**
 * Helper function to report CSP violations
 * This can be expanded to log to a service or analytics platform
 */
export function reportCspViolation(event: SecurityPolicyViolationEvent) {
  // Log the violation to console in development
  if (process.env.NODE_ENV === "development") {
    console.warn("CSP Violation:", {
      "blocked-uri": event.blockedURI,
      "violated-directive": event.violatedDirective,
      "document-uri": event.documentURI,
      "original-policy": event.originalPolicy,
    })
  }

  // In production, you could send this to your analytics or logging service
  // Example: fetch('/api/csp-report', { method: 'POST', body: JSON.stringify({...}) })
}

/**
 * Initialize CSP violation reporting
 * Call this function in your app's entry point
 */
export function initCspReporting() {
  if (typeof document !== "undefined") {
    document.addEventListener("securitypolicyviolation", reportCspViolation)
  }
}
