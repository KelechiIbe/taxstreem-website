'use client'
import { useEffect, useRef } from 'react'

/** A thin line under the header that fills as the article is read. */
export function ReadBar() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const run = () => { raf = 0; const el = document.querySelector('.art-body'); if (!el || !ref.current) return; const r = el.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / Math.max(1, r.height))); ref.current.style.transform = `scaleX(${p})` }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    addEventListener('scroll', on, { passive: true }); on()
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])
  return <div className="readbar" aria-hidden><div ref={ref} /></div>
}
