import { LLMS } from '../../content/llms'
import { articles, newsroom, videos } from '../../lib/cms'
import { FORBES } from '../../lib/seo'

export const revalidate = 300

const day = (d: string) => (d || '').slice(0, 10)
const one = (t: string) => (t || '').replace(/\s+/g, ' ').trim()

export async function GET() {
  const [arts, press, vids] = await Promise.all([articles(), newsroom(), videos()])
  const out = [LLMS.trimEnd()]
  if (arts.length) out.push('## Guides and articles\n\n' + arts.map((a) => `- [${one(a.title)}](https://www.taxstreem.com/resources/articles/${a.slug}): ${one(a.excerpt)}`).join('\n'))
  if (vids.length) out.push('## Videos\n\n' + vids.map((v) => `- [${one(v.title)}](${v.videoUrl}): ${one(v.description)}`).join('\n'))
  out.push('## Independent press coverage\n\n' + [`- [${FORBES.title}](${FORBES.url}) (Forbes, ${FORBES.date})`, ...press.map((n) => `- [${one(n.title)}](${n.externalUrl}) (${one(n.publication)})`)].join('\n'))
  out.push('## Questions people ask\n\n- What is TaxStreem? Accounting and tax filing software for Nigerian businesses and individuals. It keeps the books and prepares and files VAT, WHT, CIT and PIT returns.\n- Who is it for? Service businesses, shops and businesses that hold stock (through Countev), individuals filing Personal Income Tax, and accountants and tax consultants who run several clients.\n- What does it cost? Starter ₦30,000 a month and Growth ₦75,000 a month per business, Personal Income Tax ₦50,000 a year, free for tax professionals.\n- Who founded it? Kelechi Ibe (CEO), a tax lawyer, and Ayo Samuel (CTO), an AI engineer.')
  return new Response(out.join('\n\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=300' } })
}
