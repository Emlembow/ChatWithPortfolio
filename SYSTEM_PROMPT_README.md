# Portfolio System Prompt Builder

This system provides a comprehensive function to build an AI assistant system prompt by reading all portfolio content files and creating a structured prompt that includes complete information about the portfolio owner.

## Overview

The `buildSystemPrompt()` function reads all content files and extracts key information to create a comprehensive system prompt for an AI assistant that can effectively answer questions about the portfolio owner's background, experience, and expertise.

## Files Created

### `/lib/system-prompt.ts`
Main system prompt builder function that:
- Reads all portfolio content files
- Extracts and structures information
- Builds a comprehensive system prompt
- Includes types for BlogPost and Project

### `/test-system-prompt.js`
Simple test script to demonstrate usage

## Content Sources

The function reads from these content directories:

1. **`content/profile.md`** - Basic profile information
2. **`content/about.md`** - Professional summary
3. **`content/education.md`** - Education background and certifications
4. **`content/experience/`** - All work experience files (*.md)
5. **`content/references/`** - Professional references (*.md)
6. **`content/blog/`** - Blog posts and thought leadership (*.md)
7. **`content/projects/`** - Technical projects (*.md)

## System Prompt Structure

The generated system prompt includes:

### 1. Purpose & Role Definition
- Clear role as portfolio assistant
- Professional tone guidelines
- Scope of knowledge

### 2. Professional Background
- **Basic Information**: Name, title, contact details
- **About Section**: Professional summary
- **Education**: Degrees, certifications, training

### 3. Work Experience
For each role:
- Job title and company
- Duration and location
- Key technologies used
- Major achievements and responsibilities

### 4. Technical Projects
For each project:
- Project type and technologies
- Description and key features
- Technical challenges solved

### 5. Thought Leadership
For each blog post:
- Title and publication date
- Content summary
- Key insights and expertise demonstrated

### 6. Professional References
For each reference:
- Name and title
- Relationship context
- Full recommendation text

### 7. Skills & Expertise Summary
- Product management capabilities
- Technical skills consolidated from experience
- Industry experience areas
- Leadership experience

### 8. Communication Guidelines
- **Tone & Style**: Professional yet approachable
- **Key Messaging**: Core value propositions
- **Common Questions**: Anticipated inquiries with guidance
- **Response Guidelines**: How to structure answers

### 9. FAQ Section
Pre-written responses to common questions about:
- Background and experience
- Skills and expertise
- Career focus and goals
- Unique value proposition

## Usage

### In a Next.js API Route
```typescript
import { buildSystemPrompt } from '@/lib/system-prompt'

export async function GET() {
  try {
    const systemPrompt = await buildSystemPrompt()
    return Response.json({ systemPrompt })
  } catch (error) {
    return Response.json({ error: 'Failed to build system prompt' }, { status: 500 })
  }
}
```

### In a React Component
```typescript
import { buildSystemPrompt } from '@/lib/system-prompt'

function ChatComponent() {
  const [systemPrompt, setSystemPrompt] = useState<string>('')

  useEffect(() => {
    buildSystemPrompt().then(setSystemPrompt)
  }, [])

  // Use systemPrompt with your AI chat service
}
```

### With AI Services
The generated system prompt can be used with various AI services:
- OpenAI GPT models
- Anthropic Claude
- Local LLMs
- Custom chat implementations

## Key Features

### 1. Comprehensive Coverage
- Includes ALL portfolio content in structured format
- No manual updates required - reads directly from content files
- Maintains consistency with portfolio content

### 2. Professional Formatting
- Clean, readable structure for AI consumption
- HTML tags stripped for text-only content
- Proper section organization and hierarchy

### 3. Intelligent Content Processing
- Extracts key technologies and skills automatically
- Prioritizes recent experience and achievements
- Includes quantifiable results where available

### 4. Contextual Guidance
- Provides communication guidelines
- Includes response strategies for common questions
- Maintains professional tone appropriate for senior roles

### 5. Cached Performance
- Uses React cache for optimized performance
- Efficient content reading and processing
- Suitable for production use

## Benefits

### For Portfolio Owners
- **Consistent Representation**: AI assistant always has up-to-date information
- **Professional Quality**: Responses maintain appropriate tone and depth
- **Time Saving**: Automated content compilation eliminates manual updates
- **Comprehensive Coverage**: Nothing gets missed or overlooked

### For Users/Visitors
- **Accurate Information**: All details come directly from portfolio content
- **Detailed Responses**: AI has full context to provide specific answers
- **Professional Interaction**: Appropriate tone for business inquiries
- **Comprehensive Knowledge**: Can discuss all aspects of background and experience

## Content Requirements

To work effectively, the content files should include:

### Profile.md
- Complete frontmatter with name, title, summary, email, social links

### Experience Files
- Proper frontmatter with title, company, dates, technologies
- Detailed achievement descriptions with metrics

### Blog Posts
- Title, date, and comprehensive content
- Clear value proposition and expertise demonstration

### Projects
- Technical details and technologies used
- Problem-solving approach and outcomes

### References
- Complete recommendation text
- Context about relationship and timeframe

## Customization

The system prompt can be customized by:

1. **Modifying Template**: Edit the system prompt template in `buildSystemPrompt()`
2. **Adding Sections**: Include additional content sources
3. **Adjusting Tone**: Modify communication guidelines
4. **Custom Questions**: Add industry-specific FAQ items

## Testing

Use the provided test script:
```bash
node test-system-prompt.js
```

This will:
- Build the complete system prompt
- Show length and preview
- Validate all content sources are accessible
- Demonstrate the full functionality

## Integration Examples

### Chat API Endpoint
```typescript
// pages/api/chat.ts
import { buildSystemPrompt } from '@/lib/system-prompt'

const systemPrompt = await buildSystemPrompt()

// Use with OpenAI
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ]
})
```

### Portfolio Chat Widget
```typescript
// components/PortfolioChat.tsx
import { buildSystemPrompt } from '@/lib/system-prompt'

function PortfolioChat() {
  const [prompt, setPrompt] = useState('')
  
  useEffect(() => {
    buildSystemPrompt().then(setPrompt)
  }, [])
  
  // Chat implementation using the system prompt
}
```

This system provides a complete foundation for creating an intelligent portfolio assistant that can effectively represent the portfolio owner's professional background and expertise.