import { ArrowRight, Check } from 'lucide-react'
import { type Block, type Run, BUTTONS } from '../content/pages'
import { link } from '../lib/asset'
import { Faq } from './Faq'
import { Reveal } from './Reveal'
import { Aurora } from './Backdrop'

const SKIP = /^(Kicker|Screen|Layout|Note for Kelechi|Toggle|Badge on [A-Za-z]+|Form fields|Build note|Links):|^Martina gets her own page|^A three-question helper|^These keep their current|^\[Get API keys\] opens/
const STRIP = /^(Line under the (table|grid)|Under the (form|choices)|Also on the page, without a logo|Closing):\s*/
const href = (label: string) => link(BUTTONS[label] ?? '/contact')
const ext = (h: string) => /^https?:/.test(h)

/** Text with [Buttons] turned into links and bold runs kept. */
export function Rich({ runs, strip }: { runs: Run[]; strip?: RegExp }) {
  let first = true
  return (
    <>
      {runs.map((r, i) => {
        let t = r.t
        if (first && strip) { t = t.replace(strip, ''); first = false }
        const parts = t.split(/(\[[^\]]+\])/g).filter(Boolean).map((p, j) => {
          const m = p.match(/^\[([^\]]+)\]$/)
          if (!m) return p
          const h = href(m[1])
          return <a key={j} className="inl" href={h} target={ext(h) ? '_blank' : undefined} rel={ext(h) ? 'noopener' : undefined}>{m[1]} <ArrowRight size={14} /></a>
        })
        return r.b ? <b key={i}>{parts}</b> : <span key={i}>{parts}</span>
      })}
    </>
  )
}

export function Buttons({ text, light }: { text: string; light?: boolean }) {
  const labels = [...text.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1])
  const rest = text.replace(/\[[^\]]+\]/g, '').replace(/^[\s·]+|[\s·]+$/g, '')
  return (
    <div className="cta-row">
      {labels.map((l, i) => {
        const h = href(l)
        return <a key={l} className={`btn btn-lg ${i === 0 ? (light ? 'btn-white' : 'btn-primary') : light ? 'btn-outline' : 'btn-ghost'}`} href={h} target={ext(h) ? '_blank' : undefined} rel={ext(h) ? 'noopener' : undefined}>{l}{i === 0 && <ArrowRight size={16} />}</a>
      })}
      {rest && <span className="cta-note">{rest}</span>}
    </div>
  )
}

export const isButtons = (b: Block) => b.k === 'p' && /^\[[^\]]+\]/.test(b.x) && b.x.replace(/\[[^\]]+\]/g, '').trim().length < 24
const boldOnly = (b: Block) => b.k === 'p' && b.r.length === 1 && b.r[0].b
const lead = (b: Block) => (b.k === 'p' && b.r.length > 1 && b.r[0].b ? b.r[0].t.trim() : '')

export function DataTable({ b, id }: { b: Extract<Block, { k: 'table' }>; id?: string }) {
  return (
    <div className="dt" id={id}>
      <table>
        <thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>
          {b.rows.map((r, i) => (
            <tr key={i} style={{ ['--i' as string]: Math.min(i, 6) }}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row" data-h={b.head[j]}><Rich runs={c.r} /></th> : <td key={j} data-h={b.head[j]}><Rich runs={c.r} /></td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** The page body: every block after the hero, laid out by what it is. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = []
  let i = 0, firstFeatures = true
  type T = Extract<Block, { k: 'p' | 'h1' | 'h2' | 'h3' }>
  while (i < blocks.length) {
    const blk = blocks[i]; const key = i
    if (blk.k === 'table') {
      if (blk.head.join('|') === 'Section|Heading|Copy') {
        out.push(
          <ul key={key} className="flist" id={firstFeatures ? 'features' : undefined}>
            {blk.rows.map((r, n) => (
              <Reveal as="li" key={n} delay={Math.min(n, 5) * 50} style={{ ['--i' as string]: Math.min(n, 7) }}>
                <span className="flist-k">{r[0].x}</span>
                <h3>{r[1].x}</h3>
                <p><Rich runs={r[2].r} /></p>
              </Reveal>
            ))}
          </ul>,
        )
        firstFeatures = false
      } else out.push(<DataTable key={key} b={blk} />)
      i++; continue
    }
    if (blk.k === 'ol') { out.push(<ol key={key} className="psteps">{blk.items.map((it, n) => <Reveal as="li" key={n} delay={n * 60}><span>{n + 1}</span><p><Rich runs={it.r} /></p></Reveal>)}</ol>); i++; continue }
    if (blk.k === 'ul') { out.push(<ul key={key} className="pticks">{blk.items.map((it, n) => <li key={n}><Check size={18} /><p><Rich runs={it.r} /></p></li>)}</ul>); i++; continue }
    const b = blk as T
    if (SKIP.test(b.x) || /^Closing:/.test(b.x)) { i++; continue }
    if (b.k === 'h2' || b.k === 'h3') { out.push(<Reveal key={key} kind="blur" className="pg-h"><h2>{b.x}</h2></Reveal>); i++; continue }
    if (boldOnly(b)) {
      const next = blocks[i + 1]
      if (b.x === 'Questions') {
        const qa: [string, string][] = []
        let j = i + 1
        while (j < blocks.length && lead(blocks[j]).endsWith('?')) { const q = blocks[j] as T; qa.push([q.r[0].t.trim(), q.r.slice(1).map((r) => r.t).join('').trim()]); j++ }
        out.push(<section key={key} className="pg-faq"><h2>Questions</h2><Faq items={qa} /></section>)
        i = j; continue
      }
      if (next && next.k === 'h2') { i++; continue }
      out.push(<Reveal key={key} kind="blur" className="pg-h"><h2>{b.x.replace(/:$/, '')}</h2></Reveal>); i++; continue
    }
    if (isButtons(b)) { out.push(<div key={key} className="pg-cta"><Buttons text={b.x} /></div>); i++; continue }
    const l = lead(b)
    if (l === 'Definition:') { out.push(<Reveal key={key} className="pdef"><p><Rich runs={b.r.slice(1)} /></p></Reveal>); i++; continue }
    if (l) { out.push(<div key={key} className="pnote"><h3>{l.replace(/[:.]$/, '')}</h3><p><Rich runs={b.r.slice(1)} /></p></div>); i++; continue }
    out.push(<p key={key} className={STRIP.test(b.x) ? 'pfine' : 'ptext'}><Rich runs={b.r} strip={STRIP} /></p>)
    i++
  }
  return <>{out}</>
}

type Txt = Extract<Block, { k: 'p' | 'h1' | 'h2' | 'h3' }>
type Chap = { head?: string; blocks: Block[] }
const isPhoto = (n: React.ReactNode) => typeof n === 'object' && n !== null && 'type' in n && (n as { type: unknown }).type === 'img'
const FEAT = 'Section|Heading|Copy'
const shown = (b: Block) => b.k === 'table' || b.k === 'ul' || b.k === 'ol' || !(SKIP.test((b as Txt).x) || /^Closing:/.test((b as Txt).x))

function chapters(blocks: Block[]): Chap[] {
  const out: Chap[] = [{ blocks: [] }]
  blocks.forEach((b, i) => {
    if (b.k === 'h2' || b.k === 'h3' || boldOnly(b)) {
      const next = blocks[i + 1]
      if (boldOnly(b) && next && next.k === 'h2') return
      out.push({ head: (b as Txt).x.replace(/:$/, ''), blocks: [] })
    } else out[out.length - 1].blocks.push(b)
  })
  return out.filter((c) => c.head || c.blocks.some(shown))
}

/** The page body cut into chapters at each heading. A headed chapter keeps its heading in a rail that stays put while its list scrolls; one chapter mid-page turns dark. */
export function Chapters({ blocks, rail, dark = true }: { blocks: Block[]; rail?: React.ReactNode; dark?: boolean }) {
  const chaps = chapters(blocks)
  const cands = chaps.map((_, i) => i).filter((i) => chaps[i].head && chaps[i].head !== 'Questions' && i < chaps.length - 1 && chaps[i].blocks.some((b) => b.k !== 'p'))
  const darkAt = dark ? cands[1] ?? cands[0] ?? -1 : -1
  let railUsed = false
  return (
    <>
      {chaps.map((c, i) => {
        if (c.head === 'Questions') {
          const qs = c.blocks.filter((b) => lead(b).endsWith('?')) as Txt[]
          const rest = c.blocks.filter((b) => !lead(b).endsWith('?') && shown(b))
          return (
            <section key={i} className="chap">
              <div className="wrap pg-faq"><h2>Questions</h2><Faq items={qs.map((q) => [q.r[0].t.trim(), q.r.slice(1).map((r) => r.t).join('').trim()] as [string, string])} /></div>
              {rest.length > 0 && <div className="wrap chap-tail"><Blocks blocks={rest} /></div>}
            </section>
          )
        }
        const wide = c.blocks.some((b) => b.k === 'table' && b.head.join('|') !== FEAT && b.head.length > 2)
        const film = !c.head && !railUsed && rail && c.blocks.some((b) => b.k === 'table' && b.head.join('|') === FEAT)
        if (film) railUsed = true
        const isDark = i === darkAt
        return (
          <section key={i} className={`chap${isDark ? ' sec-dark' : ''}`} data-split={(c.head && !wide) || film || undefined}>
            {isDark && <Aurora tone="dark" />}
            <div className="wrap chap-in">
              {(c.head || film) && (
                <div className="chap-rail">
                  {c.head && <Reveal kind="blur"><h2>{c.head}</h2></Reveal>}
                  {film && (isPhoto(rail) ? <Reveal kind="wipe" className="rail-pic">{rail}</Reveal> : <Reveal kind="wipe" className="rail-film"><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden />{rail}</Reveal>)}
                </div>
              )}
              <div className="chap-body"><Blocks blocks={c.blocks} /></div>
            </div>
          </section>
        )
      })}
    </>
  )
}
