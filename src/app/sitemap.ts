import type { MetadataRoute } from 'next'
import { PAGES } from '../content/pages'
import { articles } from '../lib/cms'

const SITE = 'https://www.taxstreem.com'
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const arts = await articles()
  return [
    { url: SITE, changeFrequency: 'weekly', priority: 1 },
    ...PAGES.map((p) => ({ url: SITE + p.path, changeFrequency: 'monthly' as const, priority: /^\/(service-businesses|countev|personal-income-tax|tax-professionals|pricing)$/.test(p.path) ? 0.9 : 0.6 })),
    ...['/get-invite', '/the-bridge', '/privacy', '/terms'].map((p) => ({ url: SITE + p, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...arts.map((a) => ({ url: `${SITE}/resources/articles/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
