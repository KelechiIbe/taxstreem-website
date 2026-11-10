import type { MetadataRoute } from 'next'

// Search engines, AI answer engines and AI crawlers are all welcome: the site is written to be found and cited.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://www.taxstreem.com/sitemap.xml', host: 'https://www.taxstreem.com' }
}
