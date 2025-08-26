export default function sitemap() {
  return [
    {
      url: "https://dev-notes-site.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://dev-notes-site.vercel.app/notes",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://dev-notes-site.vercel.app/library",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://dev-notes-site.vercel.app/auth/login/admin",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }
  ]
}
