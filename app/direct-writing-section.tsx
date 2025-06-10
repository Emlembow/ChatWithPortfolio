export default function DirectWritingSection() {
  return (
    <article aria-labelledby="article-heading">
      <div
        dangerouslySetInnerHTML={{
          __html: `
          <a href="/blog/01-neural-interface-certification" 
             style="display: block; text-decoration: none; color: inherit; cursor: pointer; padding: 16px; margin: -16px; border-radius: 8px;"
             aria-labelledby="article-heading article-date"
             >
            <div style="margin-bottom: 24px;">
              <img src="/software-dashboard.png" alt="Neural Interface Certification for Product Managers article cover image" style="width: 100%; border-radius: 8px; border: 2px solid rgba(226, 232, 240, 0.1);">
            </div>
            <h3 id="article-heading" style="font-size: 20px; font-weight: bold; color: #e2e8f0; margin-bottom: 8px;">Neural Interface Certification: A PM's Guide</h3>
            <div id="article-date" style="font-size: 14px; color: #94a3b8; margin-bottom: 16px;">January 2024 • Blog Post</div>
            <p style="color: #94a3b8;">
              As product managers in the neural computing space, aligning our roadmap with Galactic Neural Safety Protocol requirements is critical for accessing Tier-7 civilization customers. Major certification standards define stringent security and operational standards...
            </p>
            <div style="margin-top: 16px; color: #3b82f6; display: flex; align-items: center;">
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-left: 4px;" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
          </a>
        `,
        }}
      />
    </article>
  )
}
