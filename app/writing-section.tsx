import Image from "next/image"

export default function WritingSection() {
  return (
    <section id="writing" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24" aria-label="Writing">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Writing</h2>
      </div>
      <div>
        <a
          href="/blog/01-neural-interface-certification"
          className="block cursor-pointer rounded-lg hover:bg-slate-800/50 hover:shadow-lg p-4 -m-4"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Image
            src="/software-dashboard.png"
            alt="Neural Interface Certification for Product Managers"
            width={800}
            height={400}
            className="rounded-lg border-2 border-slate-200/10 mb-6"
          />

          <h3 className="text-xl font-bold text-slate-200 mb-2">Neural Interface Certification: A PM's Guide</h3>

          <div className="text-sm text-slate-400 mb-4">January 2024 • Blog Post</div>

          <p className="text-slate-400">
            As product managers in the neural computing space, aligning our roadmap with Galactic Neural Safety Protocol requirements is critical for accessing Tier-7 civilization customers. Major certification standards define stringent security and operational standards...
          </p>

          <div className="mt-4 text-blue-500">Read Article →</div>
        </a>
      </div>
    </section>
  )
}
