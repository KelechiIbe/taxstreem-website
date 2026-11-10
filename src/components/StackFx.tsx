'use client'
import { useEffect } from 'react'

const CARDS = '.flist > li, .rlist > li, .pr-plans > li, .mods > li, .products > li, .dt tbody > tr, .inds > li, .ngrid > li'

/** Phones: once the next card has slid over a stacked card, trim the covered card to its top edge so nothing shows through underneath. */
export function StackFx() {
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      if (window.innerWidth > 820) return
      const tops = new Map<Element, number>()
      const cards = document.querySelectorAll<HTMLElement>(CARDS)
      cards.forEach((c) => tops.set(c, c.getBoundingClientRect().top))
      cards.forEach((c) => {
        const next = c.nextElementSibling
        const under = !!next && tops.has(next) && tops.get(next)! - tops.get(c)! < 24
        if (under !== c.hasAttribute('data-under')) c.toggleAttribute('data-under', under)
      })
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on); on()
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return null
}
