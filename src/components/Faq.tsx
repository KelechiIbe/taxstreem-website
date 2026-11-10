'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'

export function Faq({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <div key={q} className="faq-item" data-open={open === i || undefined}>
          <h3><button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{q}<Plus size={18} /></button></h3>
          <div className="faq-a"><p>{a}</p></div>
        </div>
      ))}
    </div>
  )
}
