'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FAQ } from '../content/site'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="faq">
      {FAQ.map(([q, a], i) => (
        <div key={q} className="faq-item" data-open={open === i || undefined}>
          <h3><button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}<Plus size={18} /></button></h3>
          <div className="faq-a"><p>{a}</p></div>
        </div>
      ))}
    </div>
  )
}
