import { cache } from "react"
import {
  getProfileInfo,
  getAboutContent,
  getEducation,
  getExperiences,
  getReferences,
  type Education,
} from "./content"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
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

// Helper function to read directory contents
const readDirectory = (dir: string) => {
  // Try multiple path resolution strategies for different environments
  const possiblePaths = [
    path.join(process.cwd(), dir), // Standard Next.js dev/build
    path.join(__dirname, '..', dir), // Relative to lib directory
    path.join(__dirname, '../..', dir), // For nested builds
    dir // Direct path as fallback
  ]
  
  let lastError: Error | null = null
  const attemptResults: Array<{ path: string; exists: boolean; error?: string }> = []
  
  console.log(`[system-prompt:readDirectory] Attempting to read directory: ${dir}`)
  console.log(`[system-prompt:readDirectory] Process CWD: ${process.cwd()}`)
  console.log(`[system-prompt:readDirectory] __dirname: ${__dirname}`)
  
  for (const possiblePath of possiblePaths) {
    const exists = fs.existsSync(possiblePath)
    attemptResults.push({ path: possiblePath, exists })
    
    try {
      console.log(`[system-prompt:readDirectory] Trying path: ${possiblePath} (exists: ${exists})`)
      
      if (!exists) {
        const error = new Error(`Directory does not exist at path: ${possiblePath}`)
        attemptResults[attemptResults.length - 1].error = error.message
        lastError = error
        continue
      }
      
      const files = fs.readdirSync(possiblePath)
      console.log(`[system-prompt:readDirectory] SUCCESS: Read ${dir} with ${files.length} files from ${possiblePath}`)
      return files
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.log(`[system-prompt:readDirectory] FAILED: ${possiblePath}: ${errorMsg}`)
      attemptResults[attemptResults.length - 1].error = errorMsg
      lastError = error instanceof Error ? error : new Error('Unknown error')
      continue
    }
  }
  
  // Enhanced error logging with all attempt details
  console.error(`[system-prompt:readDirectory] CRITICAL: Failed to read ${dir} from ANY path`)
  console.error(`[system-prompt:readDirectory] Attempt summary:`)
  attemptResults.forEach((result, index) => {
    console.error(`  ${index + 1}. ${result.path} - exists: ${result.exists}${result.error ? ` - error: ${result.error}` : ''}`)
  })
  console.error(`[system-prompt:readDirectory] Last error:`, lastError)
  
  throw new Error(`Cannot read directory ${dir}: ${lastError?.message || 'All path resolution attempts failed'}`)
}

// Helper function to read and parse markdown file
const readMarkdownFile = (filePath: string) => {
  // Try multiple path resolution strategies for different environments
  const possiblePaths = [
    path.join(process.cwd(), filePath), // Standard Next.js dev/build
    path.join(__dirname, '..', filePath), // Relative to lib directory
    path.join(__dirname, '../..', filePath), // For nested builds
    filePath // Direct path as fallback
  ]
  
  let lastError: Error | null = null
  const attemptResults: Array<{ path: string; exists: boolean; error?: string }> = []
  
  console.log(`[system-prompt:readMarkdownFile] Attempting to read: ${filePath}`)
  console.log(`[system-prompt:readMarkdownFile] Process CWD: ${process.cwd()}`)
  console.log(`[system-prompt:readMarkdownFile] __dirname: ${__dirname}`)
  
  for (const possiblePath of possiblePaths) {
    const exists = fs.existsSync(possiblePath)
    attemptResults.push({ path: possiblePath, exists })
    
    try {
      console.log(`[system-prompt:readMarkdownFile] Trying path: ${possiblePath} (exists: ${exists})`)
      
      if (!exists) {
        const error = new Error(`File does not exist at path: ${possiblePath}`)
        attemptResults[attemptResults.length - 1].error = error.message
        lastError = error
        continue
      }
      
      const fileContents = fs.readFileSync(possiblePath, "utf8")
      const parsed = matter(fileContents)
      console.log(`[system-prompt:readMarkdownFile] SUCCESS: Read and parsed ${filePath} from ${possiblePath} (${fileContents.length} characters)`)
      return parsed
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.log(`[system-prompt:readMarkdownFile] FAILED: ${possiblePath}: ${errorMsg}`)
      attemptResults[attemptResults.length - 1].error = errorMsg
      lastError = error instanceof Error ? error : new Error('Unknown error')
      continue
    }
  }
  
  // Enhanced error logging with all attempt details
  console.error(`[system-prompt:readMarkdownFile] CRITICAL: Failed to read ${filePath} from ANY path`)
  console.error(`[system-prompt:readMarkdownFile] Attempt summary:`)
  attemptResults.forEach((result, index) => {
    console.error(`  ${index + 1}. ${result.path} - exists: ${result.exists}${result.error ? ` - error: ${result.error}` : ''}`)
  })
  console.error(`[system-prompt:readMarkdownFile] Last error:`, lastError)
  
  throw new Error(`Cannot read file ${filePath}: ${lastError?.message || 'All path resolution attempts failed'}`)
}

// Get all blog posts
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const files = readDirectory("content/blog")

  const blogPosts = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const { data, content } = readMarkdownFile(`content/blog/${file}`)
        const htmlContent = await markdownToHtml(content)
        return {
          id: file.replace(".md", ""),
          ...data,
          content: htmlContent,
        } as BlogPost
      }),
  )

  // Sort by date (most recent first)
  return blogPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

// Get all projects
export const getProjects = cache(async (): Promise<Project[]> => {
  const files = readDirectory("content/projects")

  const projects = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const { data, content } = readMarkdownFile(`content/projects/${file}`)
        const htmlContent = await markdownToHtml(content)
        return {
          id: file.replace(".md", ""),
          ...data,
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

// System prompt builder function
export const buildSystemPrompt = cache(async (): Promise<string> => {
  try {
    console.log('Starting system prompt build process...')
    
    // Read the main template file using multi-path resolution
    const templateFilePath = 'content/system-prompt.md'
    const possibleTemplatePaths = [
      path.join(process.cwd(), templateFilePath),
      path.join(__dirname, '..', templateFilePath),
      path.join(__dirname, '../..', templateFilePath),
      templateFilePath
    ]
    
    let templateContent: string | undefined = undefined
    let templateError: Error | null = null
    
    for (const templatePath of possibleTemplatePaths) {
      try {
        console.log(`Reading main template from: ${templatePath}`)
        templateContent = fs.readFileSync(templatePath, 'utf8')
        console.log(`Successfully read main template (${templateContent.length} characters)`)
        break
      } catch (error) {
        console.log(`Failed to read template from ${templatePath}:`, error instanceof Error ? error.message : 'Unknown error')
        templateError = error instanceof Error ? error : new Error('Unknown error')
        continue
      }
    }
    
    if (!templateContent) {
      console.error(`Failed to read main template file from any path:`, templateError)
      throw new Error(`Failed to read system prompt template: ${templateError?.message || 'All path resolution attempts failed'}`)
    }

    // Read the additional system prompt file if it exists using multi-path resolution
    const additionalTemplateFilePath = 'content/system-prompt-extended.md'
    const possibleAdditionalPaths = [
      path.join(process.cwd(), additionalTemplateFilePath),
      path.join(__dirname, '..', additionalTemplateFilePath),
      path.join(__dirname, '../..', additionalTemplateFilePath),
      additionalTemplateFilePath
    ]
    
    let additionalContent = ''
    
    for (const additionalPath of possibleAdditionalPaths) {
      try {
        console.log(`Checking for extended template at: ${additionalPath}`)
        additionalContent = fs.readFileSync(additionalPath, 'utf8')
        console.log(`Successfully read extended template (${additionalContent.length} characters)`)
        break
      } catch (error) {
        // Continue trying other paths
        continue
      }
    }
    
    if (!additionalContent) {
      console.log('No extended system prompt file found, continuing with base content only')
    }

    // Fetch all content with individual error handling
    console.log('Fetching all content sources...')
    let profile: any, about: any, education: any, experiences: any, references: any, blogPosts: any, projects: any
    
    try {
      // Fetch content sources individually with detailed error tracking
      const contentResults = await Promise.allSettled([
        getProfileInfo(),
        getAboutContent(),
        getEducation(),
        getExperiences(),
        getReferences(),
        getBlogPosts(),
        getProjects(),
      ])
      
      const contentNames = ['profile', 'about', 'education', 'experiences', 'references', 'blogPosts', 'projects']
      const failedSources: string[] = []
      
      contentResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          const sourceName = contentNames[index]
          console.error(`[buildSystemPrompt] FAILED to load ${sourceName}:`, result.reason)
          failedSources.push(`${sourceName}: ${result.reason instanceof Error ? result.reason.message : 'Unknown error'}`)
        } else {
          console.log(`[buildSystemPrompt] SUCCESS: Loaded ${contentNames[index]}`)
        }
      })
      
      if (failedSources.length > 0) {
        console.error(`[buildSystemPrompt] CRITICAL: Failed to load ${failedSources.length} content sources:`)
        failedSources.forEach((error, index) => {
          console.error(`  ${index + 1}. ${error}`)
        })
        throw new Error(`Failed to load content sources: ${failedSources.join('; ')}`)
      }
      
      // Extract successful results
      [profile, about, education, experiences, references, blogPosts, projects] = contentResults.map(result => 
        result.status === 'fulfilled' ? result.value : null
      )
      
      console.log('Successfully fetched all content sources')
    } catch (error) {
      console.error(`[buildSystemPrompt] Failed to fetch content sources: ${error}`)
      throw new Error(`Failed to load content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Format work experience
    const workExperience = experiences && Array.isArray(experiences) ? experiences.map((exp, index) => `
### ${index + 1}. ${exp.title} at ${exp.company}
- **Duration**: ${exp.startDate} to ${exp.endDate}
- **Location**: ${exp.location}
- **Technologies**: ${exp.technologies.join(', ')}
- **Company**: ${exp.company} (${exp.companyUrl})

**Key Achievements**:
${exp.description.replace(/<[^>]*>/g, '').trim()}
`).join('\n') : ''

    // Format projects
    const projectsFormatted = projects && Array.isArray(projects) ? projects.map((project, index) => `
### ${index + 1}. ${project.title}
- **Type**: ${project.type}
- **Technologies**: ${project.technologies.join(', ')}
- **URL**: ${project.url}

**Description**:
${project.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n') : ''

    // Format education
    const educationFormatted = education?.sections ? education.sections.map((section: Education['sections'][0]) => `
**${section.title}**
${section.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n') : ''

    // Format references
    const referencesFormatted = references && Array.isArray(references) ? references.map((ref, index) => `
### ${index + 1}. ${ref.name}
- **Title**: ${ref.title}
- **Relationship**: ${ref.relationship}
- **Date**: ${ref.date}
- **LinkedIn**: ${ref.linkedin}

**Recommendation**:
${ref.content.replace(/<[^>]*>/g, '').trim()}
`).join('\n') : ''

    // Format blog posts
    const blogPostsFormatted = blogPosts && Array.isArray(blogPosts) ? blogPosts.map((post, index) => `
### ${index + 1}. ${post.title}
- **Published**: ${post.date}
- **URL**: ${post.url}

**Summary**:
${post.content.replace(/<[^>]*>/g, '').slice(0, 500).trim()}...
`).join('\n') : ''

    // Aggregate skills and technologies
    const allTechnologies = [...new Set(
      (experiences && Array.isArray(experiences) ? experiences.flatMap(exp => exp.technologies) : [])
        .concat(projects && Array.isArray(projects) ? projects.flatMap(proj => proj.technologies) : [])
    )]

    const skillsSummary = `
**Product Management**: Product strategy, roadmap planning, stakeholder alignment, agile methodologies, user research, market analysis

**Technical Skills**: ${allTechnologies.join(', ')}

**Industry Experience**: Digital assets/blockchain, public sector/government, SaaS platforms, e-commerce, financial services, healthcare

**Leadership**: Team management, cross-functional collaboration, international expansion, compliance and regulatory affairs
`

    // Get current role info (latest experience)
    const currentRole = experiences && Array.isArray(experiences) && experiences.length > 0 ? experiences[0] : null
    const currentRoleInfo = currentRole 
      ? `Currently ${currentRole.title} at ${currentRole.company}. ${currentRole.description.replace(/<[^>]*>/g, '').slice(0, 200).trim()}...`
      : 'Looking for new opportunities in product management.'

    // Tech stack info
    const techStackInfo = allTechnologies.length > 0 
      ? `I work with a diverse technology stack including: ${allTechnologies.slice(0, 10).join(', ')}${allTechnologies.length > 10 ? ', and many others' : ''}.`
      : 'I have experience with various modern technologies across the full product development lifecycle.'

    // Get LinkedIn URL
    const linkedinUrl = profile?.socialLinks?.find(link => link.platform === 'LinkedIn')?.url || 'Contact via email'

    // Opportunity info from about content or default
    const opportunityInfo = about?.content?.includes('[') 
      ? 'I am open to discussing opportunities that align with my experience in product management, especially roles involving scaling products, international expansion, and regulatory compliance.'
      : about?.content?.replace(/<[^>]*>/g, '').trim() || 'Looking for new opportunities in product management.'

    // Build data object for template replacement
    const templateData = {
      name: profile?.name || 'Unknown',
      title: profile?.title || 'Product Manager',
      experience_summary: profile?.summary || 'Experienced product manager',
      email: profile?.email || 'Contact via LinkedIn',
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
    console.log('Building main system prompt from template...')
    let mainPrompt: string = ''
    try {
      mainPrompt = await buildSystemPromptFromTemplate(templateContent!, templateData)
      console.log(`Successfully built main prompt (${mainPrompt.length} characters)`)
    } catch (error) {
      console.error(`Failed to build main prompt from template: ${error}`)
      throw new Error(`Template processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    // Build and append extended content if available
    let finalPrompt = mainPrompt
    if (additionalContent) {
      console.log('Processing extended template content...')
      try {
        const extendedPrompt = await buildSystemPromptFromTemplate(additionalContent, templateData)
        finalPrompt = `${mainPrompt}\n\n## EXTENDED CONTEXT\n${extendedPrompt}`
        console.log(`Successfully built extended prompt (${finalPrompt.length} total characters)`)
      } catch (error) {
        console.error(`Failed to process extended template: ${error}`)
        console.log('Continuing with main prompt only')
      }
    }

    console.log('System prompt build completed successfully')
    return finalPrompt
  } catch (error) {
    console.error('Error building system prompt:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    throw new Error(`Failed to build system prompt: ${errorMessage}`)
  }
})