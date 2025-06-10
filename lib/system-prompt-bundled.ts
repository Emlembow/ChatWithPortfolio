import { cache } from "react"
import {
  getProfileInfo,
  getAboutContent,
  getEducation,
  getExperiences,
  getReferences,
} from "./content-bundled"
import { CONTENT_BUNDLE } from "./content-bundle"
import { markdownToHtml } from "./markdown"

// Blog post type
export type BlogPost = {
  id: string
  title: string
  date: string
  url: string
  image: string
  content: string
}

// Project type
export type Project = {
  id: string
  title: string
  type: string
  url: string
  image: string
  technologies: string[]
  content: string
}

// Get all blog posts from bundle
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const blogPosts = await Promise.all(
    CONTENT_BUNDLE.blog.map(async (post) => {
      const htmlContent = await markdownToHtml(post.content)
      return {
        id: post.id,
        ...(post.data as any),
        content: htmlContent,
      } as BlogPost
    }),
  )

  // Sort by date (most recent first)
  return blogPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

// Get all projects from bundle
export const getProjects = cache(async (): Promise<Project[]> => {
  const projects = await Promise.all(
    CONTENT_BUNDLE.projects.map(async (project) => {
      const htmlContent = await markdownToHtml(project.content)
      return {
        id: project.id,
        ...(project.data as any),
        content: htmlContent,
      } as Project
    }),
  )

  return projects
})

// Helper function to read template and replace placeholders
const buildSystemPromptFromTemplate = async (templateContent: string, data: {
  name: string
  title: string
  experience_summary: string
  email: string
  linkedin_url: string
  work_experience: string
  projects: string
  education: string
  references: string
  blog_posts: string
  skills_summary: string
  current_role_info: string
  tech_stack_info: string
  opportunity_info: string
}): Promise<string> => {
  let prompt = templateContent

  // Replace all placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value)
  })

  return prompt
}

// System prompt builder function using bundled content
export const buildSystemPrompt = cache(async (): Promise<string> => {
  try {
    // Use bundled template content
    const templateContent = CONTENT_BUNDLE['system-prompt'].raw
    const additionalContent = CONTENT_BUNDLE['system-prompt-extended']?.raw || ''

    // Fetch all content
    const [profile, about, education, experiences, references, blogPosts, projects] = await Promise.all([
      getProfileInfo(),
      getAboutContent(),
      getEducation(),
      getExperiences(),
      getReferences(),
      getBlogPosts(),
      getProjects(),
    ])

    // Format work experience
    const workExperience = experiences.map((exp, index) => `
### ${index + 1}. ${exp.title} at ${exp.company}
- **Duration**: ${exp.startDate} to ${exp.endDate}
- **Location**: ${exp.location}
- **Technologies**: ${exp.technologies.join(', ')}
- **Company**: ${exp.company} (${exp.companyUrl})

**Key Achievements**:
${exp.description.replace(/<[^>]*>/g, '').trim()}
`).join('\n')

    // Format projects
    const projectsFormatted = projects.map((project, index) => `
### ${index + 1}. ${project.title}
- **Type**: ${project.type}
- **Technologies**: ${project.technologies.join(', ')}
- **URL**: ${project.url}

**Description**:
${project.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n')

    // Format education
    const educationFormatted = education.sections.map(section => `
**${section.title}**
${section.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n')

    // Format references
    const referencesFormatted = references.map((ref, index) => `
### ${index + 1}. ${ref.name}
- **Title**: ${ref.title}
- **Relationship**: ${ref.relationship}
- **Date**: ${ref.date}
- **LinkedIn**: ${ref.linkedin}

**Recommendation**:
${ref.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n')

    // Format blog posts
    const blogPostsFormatted = blogPosts.map((post, index) => `
### ${index + 1}. ${post.title}
- **Published**: ${post.date}
- **URL**: ${post.url}

**Summary**:
${post.content.replace(/<[^>]*>/g, '').slice(0, 500).trim()}...
`).join('\n')

    // Aggregate skills and technologies
    const allTechnologies = [...new Set(
      experiences.flatMap(exp => exp.technologies)
        .concat(projects.flatMap(proj => proj.technologies))
    )]

    const skillsSummary = `
**Product Management**: Product strategy, roadmap planning, stakeholder alignment, agile methodologies, user research, market analysis

**Technical Skills**: ${allTechnologies.join(', ')}

**Industry Experience**: Digital assets/blockchain, public sector/government, SaaS platforms, e-commerce, financial services, healthcare

**Leadership**: Team management, cross-functional collaboration, international expansion, compliance and regulatory affairs
`

    // Get current role info (latest experience)
    const currentRole = experiences.length > 0 ? experiences[0] : null
    const currentRoleInfo = currentRole 
      ? `Currently ${currentRole.title} at ${currentRole.company}. ${currentRole.description.replace(/<[^>]*>/g, '').slice(0, 200).trim()}...`
      : 'Looking for new opportunities in product management.'

    // Tech stack info
    const techStackInfo = allTechnologies.length > 0 
      ? `I work with a diverse technology stack including: ${allTechnologies.slice(0, 10).join(', ')}${allTechnologies.length > 10 ? ', and many others' : ''}.`
      : 'I have experience with various modern technologies across the full product development lifecycle.'

    // Get LinkedIn URL
    const linkedinUrl = profile.socialLinks.find(link => link.platform === 'LinkedIn')?.url || 'Contact via email'

    // Opportunity info from about content or default
    const opportunityInfo = about.content.includes('[') 
      ? 'I am open to discussing opportunities that align with my experience in product management, especially roles involving scaling products, international expansion, and regulatory compliance.'
      : about.content.replace(/<[^>]*>/g, '').trim()

    // Build data object for template replacement
    const templateData = {
      name: profile.name,
      title: profile.title,
      experience_summary: profile.summary,
      email: profile.email,
      linkedin_url: linkedinUrl,
      work_experience: workExperience,
      projects: projectsFormatted,
      education: educationFormatted,
      references: referencesFormatted,
      blog_posts: blogPostsFormatted,
      skills_summary: skillsSummary,
      current_role_info: currentRoleInfo,
      tech_stack_info: techStackInfo,
      opportunity_info: opportunityInfo,
      // Extended template placeholders
      detailed_projects: 'ADD_DETAILED_PROJECT_INFORMATION_HERE',
      technical_context: 'ADD_TECHNICAL_IMPLEMENTATION_DETAILS_HERE',
      methodology_insights: 'ADD_METHODOLOGY_AND_APPROACH_HERE',
      professional_philosophy: 'ADD_PROFESSIONAL_PHILOSOPHY_HERE',
      industry_perspectives: 'ADD_INDUSTRY_INSIGHTS_HERE'
    }

    // Build the main system prompt
    const mainPrompt = await buildSystemPromptFromTemplate(templateContent, templateData)
    
    // Build and append extended content if available
    let finalPrompt = mainPrompt
    if (additionalContent) {
      const extendedPrompt = await buildSystemPromptFromTemplate(additionalContent, templateData)
      finalPrompt = `${mainPrompt}\n\n## EXTENDED CONTEXT\n${extendedPrompt}`
    }

    return finalPrompt
  } catch (error) {
    console.error('Error building system prompt:', error)
    throw new Error('Failed to build system prompt')
  }
})