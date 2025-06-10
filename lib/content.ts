import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { cache } from "react"
import { markdownToHtml } from "./markdown"

// Define types for our content
export type Experience = {
  id: string
  title: string
  company: string
  companyUrl: string
  location: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
}

export type AboutContent = {
  content: string
}

export type SocialLink = {
  platform: string
  url: string
  icon: string
}

export type ProfileInfo = {
  name: string
  title: string
  summary: string
  email: string
  socialLinks: SocialLink[]
}

export type Reference = {
  id: string
  name: string
  title: string
  relationship: string
  date: string
  linkedin: string
  content: string
}

// Update the Education type to match the structure in education.md
export type Education = {
  title: string
  sections: {
    title: string
    content: string
  }[]
}

// Helper function to read directory contents
const readDirectory = (dir: string) => {
  const directory = path.join(process.cwd(), dir)
  return fs.readdirSync(directory)
}

// Helper function to read and parse markdown file
const readMarkdownFile = (filePath: string) => {
  const fullPath = path.join(process.cwd(), filePath)
  const fileContents = fs.readFileSync(fullPath, "utf8")
  return matter(fileContents)
}

// Get profile information
export const getProfileInfo = cache(async (): Promise<ProfileInfo> => {
  const { data } = readMarkdownFile("content/profile.md")
  return data as ProfileInfo
})

// Get about content
export const getAboutContent = cache(async (): Promise<AboutContent> => {
  const { data, content } = readMarkdownFile("content/about.md")
  const htmlContent = await markdownToHtml(content)

  return {
    content: htmlContent,
  }
})

// Update the getEducation function to process the sections
export const getEducation = cache(async (): Promise<Education> => {
  const { data } = readMarkdownFile("content/education.md")

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

// Get all experiences
export const getExperiences = cache(async (): Promise<Experience[]> => {
  const files = readDirectory("content/experience")

  const experiences = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const { data, content } = readMarkdownFile(`content/experience/${file}`)
        const htmlContent = await markdownToHtml(content)
        return {
          id: file.replace(".md", ""),
          ...data,
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

// Get all references
export const getReferences = cache(async (): Promise<Reference[]> => {
  const files = readDirectory("content/references")

  const references = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const { data, content } = readMarkdownFile(`content/references/${file}`)
        const htmlContent = await markdownToHtml(content)
        return {
          id: file.replace(".md", ""),
          ...data,
          content: htmlContent,
        } as Reference
      }),
  )

  // Sort by date (most recent first)
  return references.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})
