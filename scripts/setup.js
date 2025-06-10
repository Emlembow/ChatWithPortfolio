#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('🚀 Welcome to AI Portfolio Template Setup!\n');
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  console.log('\n📝 Setting up environment variables...\n');
  
  // Get OpenAI API key
  const openaiKey = await question('Enter your OpenAI API key: ');
  
  if (!openaiKey) {
    console.error('\n❌ OpenAI API key is required!');
    console.log('Get your API key from: https://platform.openai.com/api-keys\n');
    rl.close();
    return;
  }
  
  // Create .env.local
  const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${openaiKey}

# Add any other environment variables here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Created .env.local file');
  
  // Check if content directory exists
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    console.log('\n⚠️  Content directory not found. Creating example content...');
    // In a real implementation, you might copy example content here
  }
  
  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Edit the content files in the /content directory');
  console.log('2. Run `npm run dev` to start the development server');
  console.log('3. Deploy to Vercel when ready!\n');
  
  rl.close();
}

setup().catch(console.error);