"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Github, Linkedin, ExternalLink } from "lucide-react"
import Link from "next/link"
import DirectWritingSection from "@/app/direct-writing-section"
import type { Experience, ProfileInfo, AboutContent, Reference, Education } from "@/lib/content"
import DynamicEducationSection from "@/components/dynamic-education-section"

// Helper function to get icon component by name
const getIconByName = (name: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    Github,
    Linkedin,
  }
  return icons[name] || null
}

interface ClientPortfolioProps {
  profile: ProfileInfo
  about: AboutContent
  experiences: Experience[]
  references: Reference[]
  education: Education
}

export default function ClientPortfolio({ profile, about, experiences, references, education }: ClientPortfolioProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isNarrow, setIsNarrow] = useState(false)

  const socialLinks = profile.socialLinks

  // Use ResizeObserver to detect container width changes
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width
      setIsNarrow(width < 640)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="group/spotlight relative" role="document">
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: `radial-gradient(600px at 50% 50%, rgba(59, 130, 246, 0.15), transparent 80%)`,
          position: "absolute",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans">
        <a
          href="#content"
          className="absolute left-0 top-0 block -translate-x-full rounded bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white focus-visible:translate-x-0"
        >
          Skip to Content
        </a>

        {/* Responsive layout with ref for width measurement */}
        <div ref={containerRef} className={`flex gap-6 ${!isNarrow ? "flex-row justify-between" : "flex-col"}`}>
          {/* Left column / header */}
          <header
            className={`${!isNarrow ? "sticky top-0 max-h-screen w-2/5" : "w-full"} flex-col py-24`}
            role="banner"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
                <Link href="/">{profile.name}</Link>
              </h1>
              <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">{profile.title}</h2>
              <p className="mt-4 max-w-xs leading-normal">{profile.summary}</p>
              <nav className={`nav ${!isNarrow ? "block" : "hidden"}`} aria-label="Main navigation">
                <ul className="mt-16 w-max" role="list">
                  <li>
                    <a className="nav-item group flex items-center py-3" href="#about">
                      <span
                        className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"
                        aria-hidden="true"
                      ></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        About
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-item group flex items-center py-3" href="#experience">
                      <span
                        className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"
                        aria-hidden="true"
                      ></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        Experience
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-item group flex items-center py-3" href="#education">
                      <span
                        className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"
                        aria-hidden="true"
                      ></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        Education
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-item group flex items-center py-3" href="#references">
                      <span
                        className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"
                        aria-hidden="true"
                      ></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        References
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-item group flex items-center py-3" href="#writing">
                      <span
                        className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"
                        aria-hidden="true"
                      ></span>
                      <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
                        Writing
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <ul className="ml-1 mt-8 flex items-center" aria-label="Social links" role="list">
                {socialLinks.map((link) => {
                  const Icon = getIconByName(link.icon)
                  return (
                    <li key={link.platform} className="mr-5 text-xs shrink-0">
                      <a
                        className="block hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full p-1"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${link.platform} (opens in a new tab)`}
                        title={link.platform}
                      >
                        <span className="sr-only">{link.platform}</span>
                        {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </header>

          {/* Right column / main content */}
          <main id="content" className={`pt-12 py-24 ${!isNarrow ? "w-3/5" : "w-full"}`} tabIndex={-1}>
            <section id="about" className="mb-16 scroll-mt-16" aria-labelledby="about-heading">
              <div className="section-header mb-8">
                <h2 id="about-heading" className="text-2xl font-bold text-slate-200">
                  About
                </h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: about.content }} />
              </div>
            </section>

            <section id="experience" className="mb-16 scroll-mt-16" aria-labelledby="experience-heading">
              <div className="section-header mb-8">
                <h2 id="experience-heading" className="text-2xl font-bold text-slate-200">
                  Experience
                </h2>
              </div>
              <div className="space-y-6">
                {experiences.map((experience) => (
                  <section key={experience.id} className="experience-item">
                    <div className="experience-header flex-col">
                      <h3 className="role-title mb-2">
                        <a
                          href={experience.companyUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-baseline hover:text-blue-500 focus-visible:text-blue-500 group/link"
                        >
                          {experience.title} · {experience.company}
                          <ExternalLink
                            className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                            aria-hidden="true"
                          />
                        </a>
                      </h3>
                      <div className="role-meta text-left mb-3">
                        <time
                          className="role-dates"
                          dateTime={`${experience.startDate}/${experience.endDate === "Present" ? new Date().toISOString().split("T")[0] : experience.endDate}`}
                        >
                          {experience.startDate.split("-")[0]} —{" "}
                          {experience.endDate === "Present" ? "Present" : experience.endDate.split("-")[0]}
                        </time>
                        <span className="role-location ml-2">{experience.location}</span>
                      </div>
                    </div>

                    {/* Convert HTML description to a list with proper formatting */}
                    <div className="role-content">
                      <div
                        className="role-description"
                        dangerouslySetInnerHTML={{ __html: formatExperienceDescription(experience.description) }}
                      />

                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section id="education" className="mb-16 scroll-mt-16" aria-labelledby="education-heading">
              <div className="section-header mb-8">
                <h2 id="education-heading" className="text-2xl font-bold text-slate-200">
                  {education.title}
                </h2>
              </div>
              <DynamicEducationSection education={education} />
            </section>

            {/* References Section */}
            <section id="references" className="mb-16 scroll-mt-16" aria-labelledby="references-heading">
              <div className="section-header mb-8">
                <h2 id="references-heading" className="text-2xl font-bold text-slate-200">
                  References
                </h2>
              </div>
              <div className="space-y-8">
                {references.map((reference) => (
                  <div key={reference.id} className="reference-item bg-slate-800/50 rounded-lg p-6">
                    <div className="flex flex-col mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-slate-200">{reference.name}</h3>
                        <a
                          href={reference.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400 flex items-center text-sm"
                          aria-label={`${reference.name}'s LinkedIn profile`}
                        >
                          LinkedIn <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-slate-400 text-sm mt-1">{reference.title}</div>
                      <div className="text-slate-500 text-xs mt-1">
                        {reference.date}, {reference.relationship}
                      </div>
                    </div>

                    <div
                      className="reference-content text-slate-300 prose prose-sm prose-slate prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: reference.content }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="https://neurallink.quantum/professional-network/zara-quantum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  See all references <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </section>

            {/* Writing Section */}
            <section id="writing" className="mb-16 scroll-mt-16" aria-labelledby="writing-heading">
              <div className="section-header mb-8">
                <h2 id="writing-heading" className="text-2xl font-bold text-slate-200">
                  Writing
                </h2>
              </div>
              <DirectWritingSection />
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

// Helper function to format experience descriptions
function formatExperienceDescription(html: string): string {
  // If the description starts with a paragraph followed by a list, keep it as is
  // but ensure the paragraph has the role-summary class and the list has the experience-list class
  if (html.trim().startsWith("<p>") && html.includes("<ul>")) {
    return html.replace(/<p>/g, '<p class="role-summary">').replace(/<ul>/g, '<ul class="experience-list">')
  }

  // If the description is just a paragraph with no list, wrap it in a paragraph tag
  if (!html.includes("<ul>") && !html.includes("<li>")) {
    return `<p class="role-summary">${html}</p>`
  }

  // If the description is just a list or starts with a list, ensure it has the proper class
  if (html.includes("<ul>")) {
    return html.replace(/<ul>/g, '<ul class="experience-list">')
  }

  return html
}
