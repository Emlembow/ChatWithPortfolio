/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["openai"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig