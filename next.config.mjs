/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["openai"],
  images: {
    unoptimized: true,
  },
  // Ensure content files are included in deployment
  outputFileTracing: true,
  // Optimize for faster builds
  swcMinify: true,
}

export default nextConfig