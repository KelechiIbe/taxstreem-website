'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/* A film further down the page is built only when it comes within reach of the screen.
   Until then an empty box of exactly the film's size holds its place, so nothing moves when it arrives. */
export function Later({ w, h, className, children }: { w: number; h: number; className?: string; children: ReactNode }) {
  const [on, setOn] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  if (on) return <>{children}</>
  return <div ref={ref} className={`ss-fit${className ? ` ${className}` : ''}`} style={{ maxWidth: w, aspectRatio: `${w} / ${h}` }} aria-hidden />
}
