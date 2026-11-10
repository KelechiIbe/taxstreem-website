'use client'
import { useState } from 'react'
import { asset } from '../lib/asset'
import { Reveal } from './Reveal'

/** The five modules. Hovering, focusing or tapping one selects it, and a light runs round the edge of the selected card. */
export function Modules({ rows }: { rows: { name: string; role: string; text: string }[] }) {
  const [sel, setSel] = useState(0)
  return (
    <ul className="mods">
      {rows.map((r, i) => (
        <Reveal as="li" key={r.name} delay={i * 70} className={sel === i ? 'on' : ''} style={{ ['--i' as string]: i }}>
          <div className="mods-card" role="button" tabIndex={0} aria-pressed={sel === i} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(i) } }}>
            <span className="mods-ic"><img src={asset(`/modules/${r.name.toLowerCase()}-white.svg`)} alt="" /></span>
            <h2>{r.name}</h2><b>{r.role}</b><p>{r.text}</p>
          </div>
          {sel === i && <i className="beam mods-beam" aria-hidden />}
        </Reveal>
      ))}
    </ul>
  )
}
