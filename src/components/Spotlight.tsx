'use client'
import type { ReactNode } from 'react'

/* A light that follows the pointer across a card. After React Bits' SpotlightCard (MIT + Commons Clause), reduced to two CSS variables. */
export function Spotlight({ children, className = '', href }: { children: ReactNode; className?: string; href: string }) {
  return (
    <a href={href} className={`spot ${className}`} onPointerMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
    }}>{children}</a>
  )
}
