import copy from './copy.json'
import { LINKS } from './site'

export type Run = { t: string; b: boolean }
export type Block =
  | { k: 'p' | 'h1' | 'h2' | 'h3'; r: Run[]; x: string }
  | { k: 'table'; head: string[]; rows: { x: string; r: Run[] }[][] }
  | { k: 'ul' | 'ol'; items: { x: string; r: Run[] }[] }
export const COPY = copy as unknown as Record<string, Block[]>

export type Visual = 'app' | 'inventory' | 'pit' | 'portal' | 'martina' | 'review' | 'file' | 'connect' | 'einvoice' | 'api' | 'hub' | 'hero' | null
export type PageDef = { path: string; section: string; visual?: Visual; kind?: 'pricing' | 'modules' | 'integrations' | 'find' | 'contact' | 'about' | 'cms' | 'glossary' | 'industries'; photo?: number; cms?: string }

export const PAGES: PageDef[] = [
  { path: '/service-businesses', section: 'TaxStreem for Service Businesses', visual: 'app', photo: 1 },
  { path: '/countev', section: 'Countev', visual: 'inventory', photo: 2 },
  { path: '/personal-income-tax', section: 'TaxStreem for Personal Income Tax', visual: 'pit', photo: 3 },
  { path: '/tax-professionals', section: 'TaxStreem for Tax Professionals', visual: 'portal', photo: 4 },
  { path: '/martina', section: 'Martina', visual: 'martina', photo: 6 },
  { path: '/solutions/input-vat-recovery', section: 'Recover your input VAT', visual: 'hero' },
  { path: '/solutions/tax-refunds', section: 'Track refunds and credits', visual: 'review' },
  { path: '/solutions/clean-books', section: 'Books lenders and investors accept', visual: 'connect' },
  { path: '/solutions/tax-filing', section: 'File VAT, WHT, CIT and PIT on time', visual: 'file' },
  { path: '/solutions/finance-teams', section: 'Less manual work for finance teams', visual: 'review' },
  { path: '/solutions/reconciliation', section: 'Reconcile payments, books and stock', visual: 'connect' },
  { path: '/e-invoicing', section: 'E-invoicing', visual: 'einvoice' },
  { path: '/embedded-infrastructure', section: 'Embedded infrastructure', visual: 'api' },
  { path: '/integrations', section: 'Integrations', visual: 'hub', kind: 'integrations' },
  { path: '/industries', section: 'Industries', kind: 'industries' },
  { path: '/pricing', section: 'Pricing', kind: 'pricing' },
  { path: '/partners', section: 'Partners', photo: 4 },
  { path: '/modules', section: 'The modules (footer page)', kind: 'modules' },
  { path: '/security', section: 'Trust Centre' },
  { path: '/about', section: 'About Us', kind: 'about', photo: 7 },
  { path: '/contact', section: 'Contact Us', kind: 'contact' },
  { path: '/find-my-product', section: 'Find my product', kind: 'find' },
  { path: '/resources', section: 'Newsroom, Careers and Resources', kind: 'cms', cms: 'Resources' },
  { path: '/newsroom', section: 'Newsroom, Careers and Resources', kind: 'cms', cms: 'Newsroom' },
  { path: '/careers', section: 'Newsroom, Careers and Resources', kind: 'cms', cms: 'Careers' },
  { path: '/resources/glossary', section: 'Search and AI answers', kind: 'glossary' },
]

const seo = (COPY['Search and AI answers'].find((b) => b.k === 'table') as Extract<Block, { k: 'table' }>).rows
export const SEO: Record<string, { title: string; description: string }> = Object.fromEntries(seo.map((r) => [r[1].x, { title: r[2].x, description: r[3].x }]))

export const BUTTONS: Record<string, string> = {
  'Sign Up': LINKS.start, 'Get Started': LINKS.start, 'Join the partner programme': LINKS.start, 'Log in': LINKS.login,
  'See pricing': '/pricing', 'Talk to us': '/contact', 'Talk to us about e-invoicing': '/contact', 'Tell us': '/contact', 'Contact us': '/contact', 'Request security documents': '/contact',
  'See the partner programme': '/partners', 'See her on WhatsApp': '#features', 'Get API keys': LINKS.dev, 'Read the API docs': LINKS.dev, 'Read the privacy notice': LINKS.privacy,
  'See open roles': '/careers', 'Go to the home page': '/', 'See the products': '/#products', 'See embedded infrastructure': '/embedded-infrastructure',
}
export const PRODUCT_PATH: Record<string, string> = {
  'TaxStreem for Service Businesses': '/service-businesses', Countev: '/countev', 'TaxStreem for Personal Income Tax': '/personal-income-tax', 'TaxStreem for Tax Professionals': '/tax-professionals', 'Developer portal': LINKS.dev,
}
