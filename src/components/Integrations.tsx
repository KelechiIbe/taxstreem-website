'use client'
import { useState } from 'react'
import { FileUp } from 'lucide-react'
import { asset } from '../lib/asset'

export type IntRow = { cat: string; names: string[]; line: string; soon: boolean }
const LOGO: Record<string, string> = { Mono: 'mono', Paystack: 'paystack', Flutterwave: 'flutterwave', Moniepoint: 'moniepoint', Bujeti: 'bujeti', QuickBooks: 'quickbooks', Xero: 'xero', 'Zoho Books': 'zoho-books', NRS: 'nrs', LIRS: 'lirs', 'NRS Merchant Buyer Solution': 'nrs', 'Corporate Affairs Commission (CAC)': 'cac', WhatsApp: 'whatsapp', Grey: 'grey', Upwork: 'upwork', Bumpa: 'bumpa' }
const SHORT: Record<string, string> = { 'NRS Merchant Buyer Solution': 'NRS e-invoicing', 'Corporate Affairs Commission (CAC)': 'CAC', NRS: 'Nigeria Revenue Service', LIRS: 'Lagos State IRS' }
// Which filter each category answers to, and how wide its panel sits on the twelve-column grid.
const GROUP: Record<string, string> = { 'Bank accounts': 'Money', Payments: 'Money', 'POS terminals': 'Money', 'Spend management': 'Money', 'Accounting software': 'Books', 'Tax authorities': 'Tax and records', 'E-invoicing': 'Tax and records', 'Business records': 'Tax and records', Messaging: 'Messaging' }
const SPAN: Record<string, number> = { Payments: 7, 'Bank accounts': 5, 'Accounting software': 7, 'POS terminals': 5, 'Tax authorities': 5, 'E-invoicing': 4, 'Business records': 3, 'Spend management': 4, Messaging: 4 }
const ORDER = ['Payments', 'Bank accounts', 'Accounting software', 'POS terminals', 'Tax authorities', 'E-invoicing', 'Business records', 'Spend management', 'Messaging']
const FILTERS = ['All', 'Money', 'Books', 'Tax and records', 'Messaging', 'Coming soon']

export function Integrations({ rows, upload }: { rows: IntRow[]; upload: string }) {
  const [f, setF] = useState('All')
  const live = ORDER.map((c) => rows.find((r) => r.cat === c)!).filter(Boolean)
  const soon = rows.find((r) => r.soon)
  const count = (g: string) => (g === 'All' ? rows.reduce((n, r) => n + r.names.length, 0) : g === 'Coming soon' ? soon?.names.length ?? 0 : live.filter((r) => GROUP[r.cat] === g).reduce((n, r) => n + r.names.length, 0))
  const dim = (g: string) => f !== 'All' && f !== g
  const move = (e: React.PointerEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`) }
  const tile = (n: string, isSoon?: boolean) => (
    <li key={n} data-soon={isSoon || undefined}>
      <span className="ix-logo">{n === 'Countev' ? <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" /> : <img src={asset(`/partners/${LOGO[n]}.png`)} alt="" loading="lazy" />}</span>
      <b>{n === 'Countev' ? 'Countev by TaxStreem' : SHORT[n] ?? n}</b>
    </li>
  )
  return (
    <div className="ix">
      <div className="ix-filters" role="group" aria-label="Filter integrations">
        {FILTERS.map((g) => <button key={g} aria-pressed={f === g} onClick={() => setF(g)}>{g}<i>{count(g)}</i></button>)}
      </div>
      <div className="ix-grid">
        {live.map((r) => (
          <section key={r.cat} className="ix-panel spot" style={{ ['--span' as string]: SPAN[r.cat] }} data-dark={r.cat === 'Tax authorities' || undefined} data-tint={r.cat === 'Accounting software' || r.cat === 'Messaging' || undefined} data-dim={dim(GROUP[r.cat]) || undefined} onPointerMove={move}>
            {r.cat === 'Tax authorities' && <><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /></>}
            <header><h2>{r.cat}</h2><span className="ix-live"><i />Live</span></header>
            <ul className="ix-tiles">{r.names.map((n) => tile(n))}</ul>
            <p>{r.line}</p>
          </section>
        ))}
        <section className="ix-panel ix-upload spot" style={{ ['--span' as string]: 4 }} data-dim={dim('Money') || undefined} onPointerMove={move}>
          <header><h2>Bank statement upload</h2><span className="ix-live"><i />Live</span></header>
          <div className="ix-drop" aria-hidden><FileUp size={22} /><span>PDF</span><span>CSV</span><span>Scan</span></div>
          <p>{upload}</p>
        </section>
        {soon && (
          <section className="ix-panel ix-soon" style={{ ['--span' as string]: 12 }} data-dim={dim('Coming soon') || undefined}>
            <header><h2>Coming soon</h2><span className="ix-live" data-soon><i />In build</span></header>
            <ul className="ix-tiles">{soon.names.map((n) => tile(n, true))}</ul>
            <p>{soon.line}</p>
          </section>
        )}
      </div>
    </div>
  )
}
