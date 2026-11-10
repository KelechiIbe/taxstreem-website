'use client'
import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { type Block, BUTTONS } from '../content/pages'
import { link } from '../lib/asset'

export function Pricing({ table }: { table: Extract<Block, { k: 'table' }> }) {
  const [yearly, setYearly] = useState(false)
  const plans = table.head.slice(1)
  const row = (label: string) => table.rows.find((r) => r[0].x.startsWith(label))!
  const monthly = row('Monthly'), year = row('Yearly'), best = row('Best for'), cta = table.rows[table.rows.length - 1]
  const feats = table.rows.filter((r) => r[0].x && !/^(Monthly|Yearly|Best for)/.test(r[0].x))
  return (
    <div className="pr">
      <div className="pr-toggle" role="group" aria-label="Billing period">
        <button aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
        <button aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly <em>save 15%</em></button>
      </div>
      <ul className="pr-plans">
        {plans.map((p, i) => {
          const price = (yearly ? year : monthly)[i + 1].x
          const m = price.match(/^(₦[\d,]+)\s*(.*)$/)
          const label = cta[i + 1].x.replace(/[\[\]]/g, '')
          return (
            <li key={p} data-hot={i === 1 || undefined} style={{ ['--i' as string]: i }}>
              <div className="pr-top"><h2>{p}</h2>{i === 1 && <span>Most chosen</span>}</div>
              <p className="pr-price" key={price}>{m ? <><b>{m[1]}</b> {m[2]}</> : <b>{price}</b>}</p>
              <p className="pr-best">{best[i + 1].x}</p>
              <a className={`btn btn-lg ${i === 1 ? 'btn-primary' : 'btn-ghost'}`} href={link(BUTTONS[label] ?? '/contact')}>{label} <ArrowRight size={16} /></a>
              <ul className="pr-feats">{feats.map((f) => <li key={f[0].x}><Check size={16} /><span><b>{f[0].x}</b>{!/^(Included|Prepared and filed)$/.test(f[i + 1].x) && <i>{f[i + 1].x.replace(/^Included, /, '')}</i>}</span></li>)}</ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
