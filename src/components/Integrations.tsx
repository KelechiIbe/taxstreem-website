import { FileUp } from 'lucide-react'
import { asset } from '../lib/asset'
import { Reveal } from './Reveal'

export type IntRow = { cat: string; line: string; items: { name: string; soon?: boolean }[] }
const LOGO: Record<string, string> = { Mono: 'mono', Paystack: 'paystack', Flutterwave: 'flutterwave', Moniepoint: 'moniepoint', Bujeti: 'bujeti', QuickBooks: 'quickbooks', Xero: 'xero', 'Zoho Books': 'zoho-books', NRS: 'nrs', LIRS: 'lirs', 'NRS Merchant Buyer Solution': 'nrs', 'Corporate Affairs Commission (CAC)': 'cac', WhatsApp: 'whatsapp', Grey: 'grey', Upwork: 'upwork', Bumpa: 'bumpa' }
const NAME: Record<string, string> = { NRS: 'Nigeria Revenue Service', LIRS: 'Lagos State Internal Revenue Service', Countev: 'Countev by TaxStreem' }

/** Every integration in one table: what it connects on the left, each provider and its status on the right. */
export function Integrations({ rows }: { rows: IntRow[] }) {
  return (
    <div className="itab" role="table" aria-label="TaxStreem integrations">
      <div className="itab-head" role="row"><span role="columnheader">What it connects</span><span role="columnheader">Integration</span><span role="columnheader">Status</span></div>
      {rows.map((r, i) => (
        <Reveal key={r.cat} className="itab-group" delay={Math.min(i, 4) * 40}>
          <div className="itab-cat"><h2>{r.cat}</h2><p>{r.line}</p></div>
          <ul>
            {r.items.map((it) => (
              <li key={it.name} role="row">
                <span className="itab-logo" role="cell">
                  {it.name === 'Countev' ? <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" /> : LOGO[it.name] ? <img src={asset(`/partners/${LOGO[it.name]}.png`)} alt="" loading="lazy" /> : <FileUp size={26} aria-hidden />}
                </span>
                <b role="cell">{NAME[it.name] ?? it.name}</b>
                <span className="itab-st" role="cell" data-soon={it.soon || undefined}><i />{it.soon ? 'Coming soon' : 'Live'}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}
