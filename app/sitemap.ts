import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://alexquantum.neuralcompute.space",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://alexquantum.neuralcompute.space/not-found",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ]
}
