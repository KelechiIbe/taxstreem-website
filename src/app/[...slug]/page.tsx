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
import { VatClaimFilm, WhtCreditFilm, StatementsFilm, ReturnsFilm, CloseFilm, ReconFilm } from '../../demos/SolutionFilms'
import { LivePortal } from '../../components/LivePortal'
import { PortalTour } from '../../demos/PortalTour'
import { ResourcesBody, NewsroomBody } from '../../components/Cms'
import { Integrations } from '../../components/Integrations'
import { Newsletter } from '../../components/Newsletter'
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
const SOL: Record<string, React.ReactNode> = { '/solutions/input-vat-recovery': <VatClaimFilm />, '/solutions/tax-refunds': <WhtCreditFilm />, '/solutions/clean-books': <StatementsFilm />, '/solutions/tax-filing': <ReturnsFilm />, '/solutions/finance-teams': <CloseFilm />, '/solutions/reconciliation': <ReconFilm />, '/tax-professionals': <PortalTour /> }
const RAIL: Record<string, React.ReactNode> = { '/service-businesses': <ReviewFilm />, '/personal-income-tax': <ConnectFilm />, '/tax-professionals': <img className="rail-photo" src={asset('/photos/photo-4.jpg')} alt="An accountant explaining a report to a client" loading="lazy" /> }
const IND_PHOTOS = ['A shop attendant carrying a basket of produce in a supermarket aisle', 'Two waiters laying a restaurant table', 'A worker checking metal profiles on a factory floor', 'A delivery driver moving cartons from a van', 'An adviser going through a document with two clients', 'A doctor typing notes at a clinic desk']
const LOGO: Record<string, string> = { Mono: 'mono', Paystack: 'paystack', Flutterwave: 'flutterwave', Moniepoint: 'moniepoint', Bujeti: 'bujeti', QuickBooks: 'quickbooks', Xero: 'xero', 'Zoho Books': 'zoho-books', NRS: 'nrs', LIRS: 'lirs', 'NRS Merchant Buyer Solution': 'nrs', 'Corporate Affairs Commission (CAC)': 'cac', WhatsApp: 'whatsapp', Grey: 'grey', Upwork: 'upwork', Bumpa: 'bumpa' }

export default function Page({ params }: { params: { slug: string[] } }) {
  const def = find(params.slug)
  const { h1, lede, buttons, rest, closing } = parts(def)
  const sol = SOL[def.path]
  const v = sol ? null : def.visual
  const side = v && v !== 'hero' && v !== 'hub' && v !== 'app' || (v === 'app') || def.kind === 'contact'
  const tables = rest.filter((b): b is Tbl => b.k === 'table')
  const body = (def.kind === 'pricing' || def.kind === 'modules' || def.kind === 'integrations' || def.kind === 'find' || def.kind === 'contact' ? rest.filter((b) => b.k !== 'table') : rest).filter((b) => !(def.kind === 'integrations' && b.k === 'p' && /^Also on the page/.test((b as Txt).x)))
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
          {sol && <div className="wrap rise" style={{ ['--d' as string]: '300ms' }}><div className="hero-stage"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><Flow /><div className="hero-film">{sol}<i className="beam" aria-hidden /></div></div></div>}
        </section>

        {def.path === '/tax-professionals' && <section className="sec sec-dark"><Aurora tone="dark" /><div className="wrap"><Reveal className="sec-head" kind="blur"><h2>Try the portal here. Run a practice for a minute.</h2></Reveal><Reveal><LivePortal /></Reveal></div></section>}
        {v === 'app' && <section className="sec sec-dark"><Aurora tone="dark" /><div className="wrap"><Reveal className="sec-head" kind="blur"><h2>Try it here. Click through a month.</h2></Reveal><Reveal><LiveProduct /></Reveal></div></section>}
        {v === 'hub' && <section className="hub-sec"><div className="wrap"><Reveal kind="wipe" className="hub-stage"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><Hub dark /></Reveal></div></section>}

        {def.kind === 'pricing' && tables[0] && <section className="sec pg-first"><div className="wrap"><Pricing table={tables[0]} /></div></section>}
        {def.kind === 'modules' && tables[0] && (
          <section className="sec pg-first"><div className="wrap"><ul className="mods">
            {tables[0].rows.map((r, i) => (
              <Reveal as="li" key={r[0].x} delay={i * 70}><span className="mods-ic"><img src={asset(`/modules/${r[0].x.toLowerCase()}-white.svg`)} alt="" /></span><h2>{r[0].x}</h2><b>{r[1].x}</b><p>{r[2].x}</p></Reveal>
            ))}
          </ul></div></section>
        )}
        {def.kind === 'integrations' && tables[0] && (
          <section className="chap ix-sec"><div className="wrap">
            <Integrations rows={[
              ...tables[0].rows.map((r) => r[3].x === 'Live'
                ? { cat: r[0].x, line: r[2].x, items: r[1].x.split(', ').map((name) => ({ name })) }
                : { cat: r[0].x, line: r[2].x, items: [{ name: 'Countev' }, ...['Grey', 'Upwork', 'Bumpa'].map((name) => ({ name, soon: true }))] }),
              { cat: 'Bank statement upload', line: (rest.find((b) => b.k === 'p' && /^Also on the page/.test((b as Txt).x)) as Txt | undefined)?.r.slice(2).map((r) => r.t).join('').trim() || 'PDF and CSV statements read into transactions, including scanned ones.', items: [{ name: 'PDF, CSV and scanned statements' }] },
            ]} />
          </div></section>
        )}
        {def.kind === 'find' && tables[0] && (
          <section className="sec pg-first"><div className="wrap narrow"><ul className="choices">
            {tables[0].rows.map((r, i) => { const h = link(PRODUCT_PATH[r[1].x] ?? '/'); return <Reveal as="li" key={r[0].x} delay={i * 60}><a href={h} target={/^http/.test(h) ? '_blank' : undefined} rel="noopener"><span><b>{r[0].x}</b><i>{r[1].x}</i></span><ArrowRight size={20} /></a></Reveal> })}
          </ul></div></section>
        )}
        {def.cms === 'Resources' && <>
          <ResourcesBody bridgeLine="Our weekly open office. Bring a tax question, leave with an answer." />
          <section className="chap"><div className="wrap">
            <div className="pg-h" style={{ marginTop: 0 }}><h2>Guides in preparation</h2></div>
            <ol className="psteps">{(COPY['Search and AI answers'].filter((b) => b.k === 'ol')[0] as unknown as Extract<Block, { k: 'ul' | 'ol' }>).items.map((it, n) => <li key={n}><span>{n + 1}</span><p>{it.x}</p></li>)}</ol>
            <p className="ptext"><a className="inl" href={link('/resources/glossary')}>Read the tax glossary <ArrowRight size={14} /></a></p>
            <div className="news-band"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><Newsletter id="news-resources" big /></div>
          </div></section>
        </>}
        {def.cms === 'Newsroom' && <NewsroomBody />}
        {def.cms === 'Careers' && (
          <section className="sec pg-first"><div className="wrap">
            <ul className="pslots two"><Reveal as="li" kind="wipe"><Photo n={18} brief="" ratio="16 / 10" src="/photos/photo-18.jpg" alt="Three teammates working through figures at a shared desk" /></Reveal><Reveal as="li" kind="wipe" delay={100}><Photo n={19} brief="" ratio="16 / 10" src="/photos/photo-19.jpg" alt="Two engineers reviewing work on a monitor" /></Reveal></ul>
            <div className="cms"><b>Open roles will be listed here.</b><p>This page fills from the TaxStreem CMS once roles are published there. Until then, write to us about working at TaxStreem.</p><p style={{ margin: 0 }}><a className="btn btn-primary" href={link('/contact')}>Contact us <ArrowRight size={16} /></a></p></div>
          </div></section>
        )}

        {def.kind === 'industries' && tables[0] && (
          <section className="chap"><div className="wrap">
            <ul className="pslots">{IND_PHOTOS.map((brief, i) => <Reveal as="li" key={i} delay={i * 60} kind="wipe"><Photo n={12 + i} brief="" ratio="3 / 4" src={`/photos/photo-${12 + i}.jpg`} alt={brief} /></Reveal>)}</ul>
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
        {about && (() => {
          const ps = body.filter((b): b is Txt => b.k === 'p')
          const origin = ps.find((b) => /^We started/.test(b.x))?.x ?? ''
          const cut = origin.indexOf('. ') + 1
          const note = (k: string) => ps.find((b) => b.r[0].b && b.r[0].t.trim().startsWith(k))?.r.slice(1).map((r) => r.t).join('').trim() ?? ''
          const who = note('Who we are'); const sup = ps.find((b) => /^Supported by/.test(b.x))
          const btns = ps.find((b) => isButtons(b))
          return (
            <>
              <section className="chap ab"><div className="wrap">
                <div className="ab-origin">
                  <Reveal kind="blur"><p className="ab-big">{origin.slice(0, cut)}</p></Reveal>
                  <Reveal delay={120}><p className="ab-rest">{origin.slice(cut).trim()}</p></Reveal>
                </div>
                <Reveal kind="wipe" className="ab-photo"><img src={asset('/photos/photo-18.jpg')} alt="Three teammates working through figures at a shared desk" loading="lazy" /></Reveal>
                <div className="ab-vm">
                  <Reveal className="ab-card ab-vision"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><h2>Vision</h2><p>{note('Vision')}</p></Reveal>
                  <Reveal className="ab-card ab-mission" delay={100}><h2>Mission</h2><p>{note('Mission')}</p></Reveal>
                </div>
                <div className="ab-who">
                  <Reveal kind="blur"><h2>Who we are</h2></Reveal>
                  <div>
                    <ul className="ab-roles">{['Tax lawyers', 'Accountants', 'Engineers'].map((r, i) => <Reveal as="li" key={r} delay={i * 80}>{r}</Reveal>)}</ul>
                    <p>{who.slice(who.indexOf('. ') + 2)}</p>
                    <dl className="ab-facts">
                      <div><dt>Supported by</dt><dd className="ab-logos"><img src={asset('/partners/nvidia-inception.png')} alt="NVIDIA Inception" loading="lazy" /><img src={asset('/partners/google-for-startups.png')} alt="Google for Startups" loading="lazy" /></dd></div>
                      <div><dt>Offices</dt><dd>{(sup?.x.split('Offices:')[1] ?? 'Lagos, Nigeria and Delaware, USA.').trim().replace(/\.$/, '')}</dd></div>
                    </dl>
                    {btns && <Buttons text={btns.x} />}
                  </div>
                </div>
              </div></section>
              <section className="chap ab-team"><div className="wrap">
                <Reveal kind="blur"><h2>Founders</h2></Reveal>
                <ul className="founders">
                  {([['Kelechi Ibe', 'Co-Founder and CEO', 'kelechi-ibe', bios.kelechi, 'https://www.linkedin.com/in/kelechi-ibe/', 'https://x.com/IbeKelechi_'], ['Ayo Samuel', 'Co-Founder and CTO', 'ayo-samuel', bios.ayo, 'https://www.linkedin.com/in/sam-ayo/', 'https://x.com/officialsamayo']] as const).map(([n, role, f, bio, li, x], i) => (
                    <Reveal as="li" key={n} delay={i * 100}>
                      <img src={asset(`/team/${f}-bw.jpg`)} alt={n} loading="lazy" width={840} height={1120} />
                      <div><h3>{n}</h3><b>{role}</b><p>{bio[0]}</p>{bio.length > 1 && <details><summary>Read more</summary>{bio.slice(1).map((t, j) => <p key={j}>{t}</p>)}</details>}
                        <p className="socials">
                          <a href={li} target="_blank" rel="noopener" aria-label={`${n} on LinkedIn`}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>LinkedIn</a>
                          <a href={x} target="_blank" rel="noopener" aria-label={`${n} on X`}><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" /></svg>X</a>
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div></section>
            </>
          )
        })()}
        {!about && !['glossary', 'contact', 'industries', 'cms'].includes(def.kind ?? '') && body.length > 0 && <Chapters blocks={body} rail={RAIL[def.path]} dark={v !== 'app' && def.path !== '/tax-professionals' && !def.kind} />}

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
