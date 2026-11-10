'use client'
import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', kind = 'rise' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'section' | 'li'; kind?: 'rise' | 'blur' | 'wipe' }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.in = ''; io.disconnect() } }, { rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const T = Tag as 'div'
  return <T ref={ref as never} className={`reveal ${className}`} data-kind={kind} style={{ '--d': `${delay}ms` } as CSSProperties}>{children}</T>
}
