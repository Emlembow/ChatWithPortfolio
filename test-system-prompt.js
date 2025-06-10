// Simple test script to demonstrate the system prompt builder
// This would typically be called from within a Next.js API route or component

import { buildSystemPrompt } from './lib/system-prompt.ts'

async function testSystemPrompt() {
  try {
    console.log('Building comprehensive system prompt...')
    const systemPrompt = await buildSystemPrompt()
    
    console.log('System prompt generated successfully!')
    console.log('Length:', systemPrompt.length, 'characters')
    console.log('\n--- PREVIEW ---')
    console.log(systemPrompt.substring(0, 500) + '...')
    
    // You could save this to a file or return it via an API endpoint
    return systemPrompt
  } catch (error) {
    console.error('Error generating system prompt:', error)
    throw error
  }
}

// Run the test
testSystemPrompt()
  .then(prompt => {
    console.log('\n✅ System prompt generated successfully!')
  })
  .catch(error => {
    console.error('❌ Failed to generate system prompt:', error)
  })