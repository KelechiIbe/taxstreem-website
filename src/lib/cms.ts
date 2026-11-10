import { asset } from './asset'
import local from '../content/cms-images.json'

// The TaxStreem CMS, read on the server. Pages built from it refresh every five minutes, so a new article appears without a redeploy.
const BASE = (process.env.CMS_URL ?? 'https://taxstreem-cms-backend-61341992308.us-central1.run.app') + '/api/v1/public'
const PREVIEW = process.env.PREVIEW === '1'

export type BodyBlock = { id: string; type: 'heading' | 'subheading' | 'paragraph' | 'bulletlist' | 'numberedlist' | 'pullquote' | 'table' | 'callout' | 'image'; text?: string; items?: string[]; attribution?: string; headers?: string[]; rows?: string[][]; title?: string; body?: string; url?: string; caption?: string }
export type Article = { id: string; title: string; slug: string; excerpt: string; category: string; coverImage: string; coverCaption: string | null; readTime: string; body: BodyBlock[]; featured: boolean; publishedAt: string; updatedAt: string; author: { fullName: string; authorRole: string | null; authorBio: string | null } | null }
export type Video = { id: string; title: string; slug: string; description: string; category: string; thumbnail: string | null; videoUrl: string; durationSeconds: number; publishedAt: string }
export type NewsItem = { id: string; title: string; slug: string; excerpt: string; category: string; publication: string; externalUrl: string; thumbnail: string | null; publishedAt: string }
export type EventItem = { id: string; type: string; title: string; description: string; venueType: string; date: string; isActive: boolean; spotsRemaining: number }

async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(BASE + path, { next: { revalidate: 300 } })
    return r.ok ? ((await r.json()) as T) : fallback
  } catch { return fallback }
}
const byDate = <T extends { publishedAt: string }>(l: T[]) => [...l].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const articles = async () => byDate((await get<{ articles: Article[] }>('/articles', { articles: [] })).articles)
export const article = async (slug: string) => get<{ article: Article | null; related: Article[] }>(`/articles/${encodeURIComponent(slug)}`, { article: null, related: [] })
export const videos = async () => byDate((await get<{ videos: Video[] }>('/videos', { videos: [] })).videos)
export const newsroom = async () => byDate((await get<{ items: NewsItem[] }>('/newsroom', { items: [] })).items)
export const events = async () => (await get<{ data: { events: EventItem[] } }>('/events', { data: { events: [] } })).data.events.filter((e) => e.isActive).sort((a, b) => b.date.localeCompare(a.date))

/** A CMS picture. The preview build serves its own copy; the live site loads it from where the CMS keeps it. */
export const pic = (url: string | null | undefined) => (!url ? '' : PREVIEW && (local as Record<string, string>)[url] ? asset((local as Record<string, string>)[url]) : url)
export const day = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Lagos' })
export const label = (s: string) => s.trim().toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
export const mins = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

/** Body text arrives with light markup. Keep emphasis and links, drop everything else. */
export function clean(html: string) {
  return html.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (_m, close: string, tag: string, attrs: string) => {
    const t = tag.toLowerCase()
    if (['strong', 'b', 'em', 'i', 'u', 'sup', 'sub', 'code'].includes(t)) return `<${close}${t}>`
    if (t === 'br') return '<br>'
    if (t === 'a') {
      if (close) return '</a>'
      const h = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? ''
      return /^(https?:|mailto:)/i.test(h) ? `<a href="${h.replace(/"/g, '&quot;')}" target="_blank" rel="noopener">` : '<a>'
    }
    return ''
  })
}
export const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
