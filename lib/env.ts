// Environment variable validation
export function validateEnv() {
  const required = ['OPENAI_API_KEY']
  const missing = []
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env.local file or Vercel environment settings.'
    )
  }
}

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4.1-nano-2025-04-14',
}