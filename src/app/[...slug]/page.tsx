import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { Reveal } from '../../components/Reveal'
import { Aurora, Flow, Grain } from '../../components/Backdrop'
import { Photo } from '../../components/Photo'
import { Hub } from '../../components/Hub'
import { Chapters, Blocks, Buttons, DataTable, Rich, isButtons } from '../../components/Blocks'
import { Pricing } from '../../components/Pricing'
import { ContactForm } from '../../components/ContactForm'
import { LiveProduct } from '../../components/LiveProduct'
import { HeroFilm } from '../../demos/HeroFilm'
import { MartinaChat } from '../../demos/MartinaChat'
import { ReviewFilm, FileFilm, ConnectFilm, EInvoiceFilm, InventoryFilm, PitFilm, PortalFilm } from '../../demos/MiniFilms'
import { PAGES, COPY, SEO, PRODUCT_PATH, type Block, type PageDef } from '../../content/pages'
import { LINKS } from '../../content/site'
import bios from '../../content/bios.json'
import { asset, link } from '../../lib/asset'

type Tbl = Extract<Block, { k: 'table' }>
type Txt = Extract<Block, { k: 'p' | 'h1' | 'h2' | 'h3' }>
const find = (slug: string[]) => PAGES.find((p) => p.path === '/' + slug.join('/'))!
export const dynamicParams = false
export function generateStaticParams() { return PAGES.map((p) => ({ slug: p.path.slice(1).split('/') })) }

function parts(def: PageDef) {
  let blocks = COPY[def.section]
  if (def.kind === 'cms') {
    const row = (blocks.find((b) => b.k === 'table') as Tbl).rows.find((r) => r[0].x === def.cms)!
    return { h1: row[1].x, lede: row[2].x.replace(/ from your CMS/, ''), buttons: '', rest: [] as Block[], closing: '' }
  }
  if (def.kind === 'glossary') return { h1: 'Nigerian tax terms, in plain words.', lede: '', buttons: '', rest: [blocks.filter((b) => b.k === 'table')[1]], closing: '' }
  const hi = blocks.findIndex((b) => b.k === 'h1')
  const h1 = (blocks[hi] as Txt).x
  blocks = blocks.slice(hi + 1)
  let lede = '', buttons = ''
  const plain = (b: Block): b is Txt => b.k === 'p' && !b.r[0].b && !/^(Kicker|Screen|Layout|Toggle|Closing|Form fields|Under the|Line under|Also on|\[)/.test(b.x)
  if (blocks[0] && plain(blocks[0])) { lede = (blocks[0] as Txt).x; blocks = blocks.slice(1) }
  else { const d = blocks[0] as unknown as Txt | undefined; if (d && d.k === 'p' && d.r[0].t.trim() === 'Definition:') { lede = d.r.slice(1).map((r) => r.t).join('').trim(); blocks = blocks.slice(1) } }
  if (blocks[0] && blocks[0].k === 'p' && /^\[/.test(blocks[0].x) && !/opens /.test(blocks[0].x)) { buttons = blocks[0].x; blocks = blocks.slice(1) }
  const c = blocks.find((b) => b.k === 'p' && /^Closing:/.test(b.x)) as Txt | undefined
  if (!buttons && def.path.startsWith('/solutions/')) buttons = '[Sign Up] [See pricing]'
  return { h1, lede, buttons, rest: blocks, closing: c ? c.x.replace(/^Closing:\s*/, '') : '' }
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const def = find(params.slug); const p = parts(def); const s = SEO[def.path]
  return { title: s?.title ?? `${p.h1.replace(/\.$/, '')} | TaxStreem`, description: s?.description ?? p.lede, alternates: { canonical: def.path } }
}

const FILMS: Record<string, React.ReactNode> = { review: <ReviewFilm />, file: <FileFilm />, connect: <ConnectFilm />, einvoice: <EInvoiceFilm />, inventory: <InventoryFilm />, pit: <PitFilm />, portal: <PortalFilm /> }
const ALT = ['', 'Two colleagues reviewing figures on a tablet', 'A pharmacist serving a customer', 'A freelancer working on a laptop at home', 'An accountant explaining a report to a client', '', 'A business owner reading a message on his phone', 'A small team gathered around a laptop']
const RAIL: Record<string, React.ReactNode> = { '/service-businesses': <ReviewFilm />, '/personal-income-tax': <ConnectFilm />, '/tax-professionals': <FileFilm /> }
const IND_PHOTOS = ['Shop floor of a supermarket or pharmacy, a cashier at the till', 'Restaurant or cafe in service, staff plating or serving', 'Small factory floor or a production line, workers in view', 'Warehouse or a delivery van being loaded with cartons', 'Lawyers or consultants at work around a table', 'A clinic or school front desk with a member of staff']
const LOGO: Record<string, string> = { Mono: 'mono', Paystack: 'paystack', Flutterwave: 'flutterwave', Moniepoint: 'moniepoint', Bujeti: 'bujeti', QuickBooks: 'quickbooks', Xero: 'xero', 'Zoho Books': 'zoho-books', NRS: 'nrs', LIRS: 'lirs', 'NRS Merchant Buyer Solution': 'nrs', 'Corporate Affairs Commission (CAC)': 'cac', WhatsApp: 'whatsapp', Grey: 'grey', Upwork: 'upwork', Bumpa: 'bumpa' }

export default function Page({ params }: { params: { slug: string[] } }) {
  const def = find(params.slug)
  const { h1, lede, buttons, rest, closing } = parts(def)
  const v = def.visual
  const side = v && v !== 'hero' && v !== 'hub' && v !== 'app' || (v === 'app') || def.kind === 'contact'
  const tables = rest.filter((b): b is Tbl => b.k === 'table')
  const body = def.kind === 'pricing' || def.kind === 'modules' || def.kind === 'integrations' || def.kind === 'find' || def.kind === 'contact' ? rest.filter((b) => b.k !== 'table') : rest
  const about = def.kind === 'about'
  const faq = rest.flatMap((b, i) => (b.k === 'p' && b.r.length > 1 && b.r[0].b && b.r[0].t.trim().endsWith('?') ? [{ '@type': 'Question', name: b.r[0].t.trim(), acceptedAnswer: { '@type': 'Answer', text: b.r.slice(1).map((r) => r.t).join('').trim() } }] : []))
  const ld = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.taxstreem.com/' }, { '@type': 'ListItem', position: 2, name: h1, item: 'https://www.taxstreem.com' + def.path }] }, ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq }] : [])]
  const closeText = closing.replace(/\[[^\]]+\]/g, '').trim() || 'Month-end is coming. Have it done.'
  const closeBtns = closing.match(/\[[^\]]+\]/g)?.join(' ') || '[Sign Up] [Talk to us]'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Grain />
      <Header />
      <main className="pg">
        <section className="pg-hero" data-side={side || undefined} data-v={v || undefined} data-dark={def.path === '/security' || undefined}>
          <Aurora tone={def.path === '/security' ? 'dark' : 'plain'} />
          <div className="wrap pg-hero-in">
            <div className="pg-hero-copy">
              <h1 className="rise">{h1}</h1>
              {lede && <p className="lede rise" style={{ ['--d' as string]: '120ms' }}>{lede}</p>}
              {buttons && <div className="rise" style={{ ['--d' as string]: '200ms' }}><Buttons text={buttons} /></div>}
              {def.kind === 'contact' && tables[0] && <ul className="clist rise" style={{ ['--d' as string]: '200ms' }}>{tables[0].rows.map((r) => <li key={r[0].x}><span>{r[0].x}</span><a href={`mailto:${r[1].x}`}>{r[1].x}</a></li>)}</ul>}
            </div>
            {def.kind === 'contact' && <div className="rise" style={{ ['--d' as string]: '260ms' }}><ContactForm /></div>}
            {v === 'martina' && <div className="stack-phone rise" style={{ ['--d' as string]: '260ms' }}><Photo n={6} brief="" ratio="auto" src="/photos/photo-6.jpg" alt={ALT[6]} /><MartinaChat /></div>}
            {v === 'app' && def.photo && <div className="pg-shot rise" style={{ ['--d' as string]: '260ms' }}><Photo n={def.photo} brief="" ratio="4 / 3" src={`/photos/photo-${def.photo}.jpg`} alt={ALT[def.photo]} /></div>}
            {v && FILMS[v] && (
              <div className="stack rise" style={{ ['--d' as string]: '260ms' }} data-solo={!def.photo || undefined}>
                {def.photo ? <Photo n={def.photo} brief="" ratio="4 / 5" src={`/photos/photo-${v === 'inventory' ? 5 : def.photo}.jpg`} alt={ALT[v === 'inventory' ? 2 : def.photo]} /> : <div className="vstage"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /></div>}
                <div className="film">{FILMS[v]}</div>
              </div>
            )}
            {v === 'api' && (
              <div className="vstage vcode rise" style={{ ['--d' as string]: '260ms' }}><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden />
                <pre aria-label="Example API call"><code>{`POST /v1/vat/compute\n{ "amount": 850000, "inclusive": false }\n\n200 OK\n{ "vat": 63750, "rate": 0.075, "total": 913750 }\n\nPOST /v1/einvoice\n201 Created\n{ "irn": "INV00412-7C4E91A2-20261110",\n  "status": "signed" }`}</code></pre>
              </div>
            )}
          </div>
          {v === 'hero' && <div className="wrap rise" style={{ ['--d' as string]: '300ms' }}><div className="hero-stage"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><Flow /><div className="hero-film"><HeroFilm /><i className="beam" aria-hidden /></div></div></div>}
        </section>

        {v === 'app' && <section className="sec sec-dark"><Aurora tone="dark" /><div className="wrap"><Reveal className="sec-head" kind="blur"><h2>Try it here. Click through a month.</h2></Reveal><Reveal><LiveProduct /></Reveal></div></section>}
        {v === 'hub' && <section className="sec sec-tight"><div className="wrap"><Reveal><Hub /></Reveal></div></section>}

        {def.kind === 'pricing' && tables[0] && <section className="sec pg-first"><div className="wrap"><Pricing table={tables[0]} /></div></section>}
        {def.kind === 'modules' && tables[0] && (
          <section className="sec pg-first"><div className="wrap"><ul className="mods">
            {tables[0].rows.map((r, i) => (
              <Reveal as="li" key={r[0].x} delay={i * 70}><span className="mods-ic"><img src={asset(`/modules/${r[0].x.toLowerCase()}-white.svg`)} alt="" /></span><h2>{r[0].x}</h2><b>{r[1].x}</b><p>{r[2].x}</p></Reveal>
            ))}
          </ul></div></section>
        )}
        {def.kind === 'integrations' && tables[0] && (
          <section className="sec pg-first"><div className="wrap"><div className="igrid">
            {tables[0].rows.map((r) => {
              const soon = r[3].x !== 'Live'
              const names = (soon ? ['Grey', 'Upwork', 'Bumpa', 'Countev'] : r[1].x.split(', '))
              return (
                <section key={r[0].x}><h2>{soon ? 'Coming soon' : r[0].x}</h2><p>{soon ? 'Earnings and store sales pulled in for your books and your annual return.' : r[2].x}</p>
                  <ul>{names.map((n) => <li key={n} data-soon={soon || undefined}>{n === 'Countev' ? <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="Countev by TaxStreem" /> : <img src={asset(`/partners/${LOGO[n]}.png`)} alt={n} loading="lazy" />}<span>{n === 'NRS Merchant Buyer Solution' ? 'NRS e-invoicing' : n.replace(/ \(CAC\)/, '')}</span><em>{soon ? 'Coming soon' : 'Live'}</em></li>)}</ul>
                </section>
              )
            })}
          </div></div></section>
        )}
        {def.kind === 'find' && tables[0] && (
          <section className="sec pg-first"><div className="wrap narrow"><ul className="choices">
            {tables[0].rows.map((r, i) => { const h = link(PRODUCT_PATH[r[1].x] ?? '/'); return <Reveal as="li" key={r[0].x} delay={i * 60}><a href={h} target={/^http/.test(h) ? '_blank' : undefined} rel="noopener"><span><b>{r[0].x}</b><i>{r[1].x}</i></span><ArrowRight size={20} /></a></Reveal> })}
          </ul></div></section>
        )}
        {def.kind === 'cms' && (
          <section className="sec pg-first"><div className="wrap">
            {def.cms === 'Careers' && <ul className="pslots two"><li><Photo n={18} brief="The TaxStreem team at work in the Lagos office, candid and wide" ratio="16 / 10" /></li><li><Photo n={19} brief="Two or three teammates talking through a problem at a screen" ratio="16 / 10" /></li></ul>}
            <div className="cms"><b>This page fills from the TaxStreem CMS.</b><p>Every {def.cms === 'Careers' ? 'open role' : def.cms === 'Newsroom' ? 'press item' : 'article, video and guide'} already published there appears here in this design once the site is connected to it.</p>
              <ul aria-hidden>{[0, 1, 2].map((i) => <li key={i}><i /><span /><span /></li>)}</ul></div>
            {def.cms === 'Resources' && <><div className="pg-h"><h2>Guides in preparation</h2></div><ol className="psteps">{(COPY['Search and AI answers'].filter((b) => b.k === 'ol')[0] as unknown as Extract<Block, { k: 'ul' | 'ol' }>).items.map((it, n) => <li key={n}><span>{n + 1}</span><p>{it.x}</p></li>)}</ol><p className="ptext"><a className="inl" href={link('/resources/glossary')}>Read the tax glossary <ArrowRight size={14} /></a></p></>}
          </div></section>
        )}

        {def.kind === 'industries' && tables[0] && (
          <section className="chap"><div className="wrap">
            <ul className="pslots">{IND_PHOTOS.map((brief, i) => <Reveal as="li" key={i} delay={i * 60} kind="wipe"><Photo n={12 + i} brief={brief} ratio="3 / 4" /></Reveal>)}</ul>
            <ul className="inds">
              {tables[0].rows.map((r, i) => (
                <Reveal as="li" key={r[0].x} delay={Math.min(i, 5) * 50} style={{ ['--i' as string]: Math.min(i, 7) }}>
                  <h3>{r[0].x}</h3>
                  <span className="inds-p">{r[1].x.split(' or ').map((n) => { const k = /Countev/.test(n) ? '/countev' : /Personal/.test(n) ? '/personal-income-tax' : '/service-businesses'; return <a key={n} href={link(k)}>{n.replace(/^TaxStreem for /, '')}<ArrowRight size={13} /></a> })}</span>
                  <p>{r[2].x}</p>
                </Reveal>
              ))}
            </ul>
            <Blocks blocks={rest.filter((b) => b.k !== 'table')} />
          </div></section>
        )}
        {def.kind === 'glossary' && <section className="chap"><div className="wrap"><DataTable b={body[0] as Tbl} /></div></section>}
        {about && <Chapters blocks={body.filter((b) => !(b.k === 'p' && /^(Kelechi Ibe|Ayo Samuel)/.test(b.x)))} dark={false} />}
        {about && (
          <section className="chap"><div className="wrap">
            <ul className="founders">
              {([['Kelechi Ibe', 'Co-Founder and CEO', 'kelechi-ibe', bios.kelechi], ['Ayo Samuel', 'Co-Founder and CTO', 'ayo-samuel', bios.ayo]] as const).map(([n, role, f, bio], i) => (
                <Reveal as="li" key={n} delay={i * 100}><img src={asset(`/team/${f}.jpg`)} alt={n} loading="lazy" /><div><h3>{n}</h3><b>{role}</b><p>{bio[0]}</p>{bio.length > 1 && <details><summary>Read more</summary>{bio.slice(1).map((t, j) => <p key={j}>{t}</p>)}</details>}</div></Reveal>
              ))}
            </ul>
          </div></section>
        )}
        {!about && !['glossary', 'contact', 'industries', 'cms'].includes(def.kind ?? '') && body.length > 0 && <Chapters blocks={body} rail={RAIL[def.path]} dark={v !== 'app' && !def.kind} />}

        <section className="closing">
          <img className="closing-photo" src={asset('/photos/photo-7.jpg')} alt="" loading="lazy" />
          <div className="closing-shade" aria-hidden />
          <div className="wrap"><Reveal kind="blur"><h2>{closeText}</h2><div style={{ marginTop: 32 }}><Buttons text={closeBtns} light /></div></Reveal></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
