import { cache } from "react"
import { CONTENT_BUNDLE } from "./content-bundle"
import { markdownToHtml } from "./markdown"
import type {
  Experience,
  AboutContent,
  SocialLink,
  ProfileInfo,
  Reference,
  Education
} from "./content"

// Get profile information from bundle
export const getProfileInfo = cache(async (): Promise<ProfileInfo> => {
  const data = CONTENT_BUNDLE.profile.data
  return {
    name: data.name,
    title: data.title,
    summary: data.summary,
    email: data.email,
    socialLinks: [...data.socialLinks] as SocialLink[]
  }
})

// Get about content from bundle
export const getAboutContent = cache(async (): Promise<AboutContent> => {
  const htmlContent = await markdownToHtml(CONTENT_BUNDLE.about.content)
  return {
    content: htmlContent,
  }
})

// Get education from bundle
export const getEducation = cache(async (): Promise<Education> => {
  const data = CONTENT_BUNDLE.education.data as any
  
  // Process the sections to convert markdown to HTML
  const sections = await Promise.all(
    (data.sections || []).map(async (section: { title: string; content: string }) => {
      const htmlContent = await markdownToHtml(section.content)
      return {
        title: section.title,
        content: htmlContent,
      }
    }),
  )

  return {
    title: data.title,
    sections: sections,
  }
})

// Get all experiences from bundle
export const getExperiences = cache(async (): Promise<Experience[]> => {
  const experiences = await Promise.all(
    CONTENT_BUNDLE.experience.map(async (exp) => {
      const htmlContent = await markdownToHtml(exp.content)
      return {
        id: exp.id,
        ...(exp.data as any),
        description: htmlContent,
      } as Experience
    }),
  )

  return experiences.sort((a, b) => {
    // Sort by date (most recent first)
    if (a.endDate === "Present") return -1
    if (b.endDate === "Present") return 1
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })
})

// Get all references from bundle
export const getReferences = cache(async (): Promise<Reference[]> => {
  const references = await Promise.all(
    CONTENT_BUNDLE.references.map(async (ref) => {
      const htmlContent = await markdownToHtml(ref.content)
      return {
        id: ref.id,
        ...(ref.data as any),
        content: htmlContent,
      } as Reference
    }),
  )

  // Sort by date (most recent first)
  return references.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})