'use client'
import { useEffect, useRef, useState } from 'react'
import { Briefcase, Store, User, Scale, ChevronDown, ArrowUpRight, Menu, X, ArrowRight } from 'lucide-react'
import { NAV, LINKS, type NavItem } from '../content/site'
import { asset, link } from '../lib/asset'

const ICONS: Record<string, React.ReactNode> = {
  briefcase: <Briefcase size={18} />, store: <Store size={18} />, user: <User size={18} />, scale: <Scale size={18} />,
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null)
  const [sheet, setSheet] = useState(false)
  const [acc, setAcc] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    const key = (e: KeyboardEvent) => e.key === 'Escape' && (setOpen(null), setSheet(false))
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('keydown', key) }
  }, [])
  useEffect(() => { document.body.style.overflow = sheet ? 'hidden' : '' }, [sheet])

  const enter = (l: string) => { clearTimeout(timer.current); setOpen(l) }
  const leave = () => { timer.current = setTimeout(() => setOpen(null), 140) }
  const current = NAV.find((n) => n.label === open && n.groups)

  // On phones the announcement scrolls away and only the bar stays pinned.
  const hdr = useRef<HTMLElement>(null)
  useEffect(() => {
    const fit = () => {
      const el = hdr.current; if (!el) return
      const strip = el.querySelector<HTMLElement>('.strip'); const bar = el.querySelector<HTMLElement>('.hdr-bar')
      const phone = window.innerWidth <= 820
      el.style.top = phone && strip ? `-${strip.offsetHeight}px` : ''
      if (phone && bar) document.documentElement.style.setProperty('--hdr', `${bar.offsetHeight}px`)
      else document.documentElement.style.removeProperty('--hdr')
    }
    fit(); window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <>
    <header ref={hdr} className="hdr" data-scrolled={scrolled || undefined} data-open={current ? '' : undefined}>
      <a className="strip" href={link('/e-invoicing')}>
        <span>E-invoicing is coming to every Nigerian business. See how TaxStreem gets you ready.</span>
        <b>Read more <ArrowRight size={14} /></b>
      </a>
      <div className="hdr-bar">
        <a href={link('/')} className="hdr-logo" aria-label="TaxStreem home">
          <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="TaxStreem" width={132} height={24} />
        </a>
        <nav ref={nav} className="hdr-nav" aria-label="Main" onMouseLeave={leave}>
          {NAV.map((n) =>
            n.groups ? (
              <button key={n.label} className="hdr-item" aria-expanded={open === n.label} aria-haspopup="true"
                onMouseEnter={() => enter(n.label)} onFocus={() => enter(n.label)} onClick={() => setOpen(open === n.label ? null : n.label)}>
                {n.label} <ChevronDown size={14} />
              </button>
            ) : (
              <a key={n.label} className="hdr-item" href={link(n.href!)} onMouseEnter={() => enter('')}>{n.label}</a>
            ),
          )}
        </nav>
        <div className="hdr-cta">
          <a className="hdr-login" href={LINKS.login}>Log in</a>
          <a className="btn btn-primary" href={LINKS.start}>Get Started</a>
          <button className="hdr-burger" aria-label="Open menu" onClick={() => setSheet(true)}><Menu size={22} /></button>
        </div>
      </div>

      <div className="mega" data-show={current ? '' : undefined} onMouseEnter={() => clearTimeout(timer.current)} onMouseLeave={leave}>
        {current && <Panel key={current.label} item={current} />}
      </div>

    </header>
    <div className="sheet" data-show={sheet || undefined} aria-hidden={!sheet}>
      <div className="sheet-top">
        <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="TaxStreem" width={120} height={22} />
        <button aria-label="Close menu" onClick={() => setSheet(false)}><X size={22} /></button>
      </div>
      <div className="sheet-body">
        {NAV.map((n) =>
          n.groups ? (
            <div key={n.label} className="sheet-group" data-open={acc === n.label || undefined}>
              <button onClick={() => setAcc(acc === n.label ? null : n.label)} aria-expanded={acc === n.label}>{n.label}<ChevronDown size={18} /></button>
              <div className="sheet-links">
                {n.groups.flatMap((g) => g.links).map((l) => (
                  <a key={l.label} href={link(l.href)} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener' : undefined}>{l.label}</a>
                ))}
              </div>
            </div>
          ) : (
            <a key={n.label} className="sheet-link" href={link(n.href!)}>{n.label}</a>
          ),
        )}
      </div>
      <div className="sheet-foot">
        <a className="btn btn-ghost" href={LINKS.login}>Log in</a>
        <a className="btn btn-primary" href={LINKS.start}>Get Started</a>
      </div>
    </div>
    </>
  )
}

function Panel({ item }: { item: NavItem }) {
  return (
    <div className="mega-in" data-cols={(item.groups!.length + (item.card ? 1 : 0))}>
      {item.intro && <p className="mega-intro">{item.intro}</p>}
      <div className="mega-grid">
        {item.groups!.map((g, gi) => (
          <div key={gi} className="mega-col">
            {g.heading && <h3>{g.heading}</h3>}
            {g.links.map((l, i) => (
              <a key={l.label} href={link(l.href)} className="mega-link" style={{ ['--i' as string]: i }} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener' : undefined}>
                {l.icon && (
                  <span className="mega-ic">
                    {l.icon === 'martina' ? <img src={asset('/modules/martina-blue.svg')} alt="" width={18} height={18} /> : ICONS[l.icon]}
                  </span>
                )}
                <span>
                  <b>{l.label}{l.external && <ArrowUpRight size={13} />}{l.tag && <em>{l.tag}</em>}</b>
                  <i>{l.line}</i>
                </span>
              </a>
            ))}
          </div>
        ))}
        {item.card && (
          <a className="mega-card" href={link(item.card.href)}>
            <b>{item.card.title}</b>
            <i>{item.card.line}</i>
            <span>{item.card.cta} <ArrowRight size={14} /></span>
          </a>
        )}
      </div>
    </div>
  )
}
