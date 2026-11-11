import type { Metadata } from 'next'

export const SITE_URL = 'https://www.taxstreem.com'
export const ORG_ID = `${SITE_URL}/#organization`

/** File name of a page's sharing card in /public/og (made by scripts/og.mjs). */
export const ogSlug = (path: string) => (path === '/' ? 'home' : path.slice(1).replace(/\//g, '-'))

/** Title, description, canonical address and sharing tags for one page. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  const share = title.replace(/ \| TaxStreem$/, '')
  const image = { url: `/og/${ogSlug(path)}.jpg`, width: 1200, height: 630, alt: share }
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: share, description, url: path, siteName: 'TaxStreem', locale: 'en_NG', type: 'website', images: [image] },
    twitter: { card: 'summary_large_image', site: '@taxstreem', title: share, description, images: [image.url] },
  }
}

export const FOUNDERS = [
  { '@type': 'Person', name: 'Kelechi Ibe', jobTitle: 'Co-Founder and CEO', worksFor: { '@id': ORG_ID }, sameAs: ['https://www.linkedin.com/in/kelechi-ibe/', 'https://x.com/IbeKelechi_'] },
  { '@type': 'Person', name: 'Ayo Samuel', jobTitle: 'Co-Founder and CTO', worksFor: { '@id': ORG_ID }, sameAs: ['https://www.linkedin.com/in/sam-ayo/', 'https://x.com/officialsamayo'] },
]

export const ORG = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': ORG_ID,
  name: 'TaxStreem', legalName: 'TaxStreem Technologies Inc.', url: SITE_URL,
  logo: `${SITE_URL}/brand/taxstreem-logo-blue.svg`, image: `${SITE_URL}/og/home.jpg`,
  description: 'Accounting and tax filing software for businesses and individuals in Nigeria.',
  areaServed: { '@type': 'Country', name: 'Nigeria' }, email: 'hello@taxstreem.com',
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', email: 'sales@taxstreem.com', areaServed: 'NG', availableLanguage: 'en' },
    { '@type': 'ContactPoint', contactType: 'customer support', email: 'support@taxstreem.com', areaServed: 'NG', availableLanguage: 'en' },
  ],
  sameAs: ['https://www.linkedin.com/company/taxstreem', 'https://x.com/taxstreem', 'https://www.instagram.com/taxstreem', 'https://www.youtube.com/@taxstreem'],
  founder: FOUNDERS,
}

type Plan = { name: string; price: string; per: 'month' | 'year'; note?: string }
/** A product and what it costs, as search and answer engines read it. */
export function software(name: string, path: string, description: string, plans: Plan[]) {
  return {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name, url: SITE_URL + path, description,
    applicationCategory: 'BusinessApplication', applicationSubCategory: 'Accounting and tax software', operatingSystem: 'Web', areaServed: { '@type': 'Country', name: 'Nigeria' },
    publisher: { '@id': ORG_ID },
    offers: plans.map((p) => ({
      '@type': 'Offer', name: p.name, price: p.price, priceCurrency: 'NGN', url: `${SITE_URL}/pricing`, availability: 'https://schema.org/InStock',
      ...(p.note ? { description: p.note } : {}),
      ...(p.price !== '0' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'NGN', unitText: p.per } } : {}),
    })),
  }
}
