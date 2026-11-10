'use client'
import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const URL = process.env.NEXT_PUBLIC_NEWSLETTER_URL ?? ''
type St = 'idle' | 'noname' | 'bad' | 'busy' | 'done' | 'error'

/** Newsletter sign-up. Posts { name, email, source } as JSON to NEXT_PUBLIC_NEWSLETTER_URL; without one (the preview) it only shows the confirmation. */
export function Newsletter({ id = 'news', big }: { id?: string; big?: boolean }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [st, setSt] = useState<St>('idle')
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) return setSt('noname')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setSt('bad')
    if (!URL) return setSt('done')
    setSt('busy')
    try {
      const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), email: email.trim(), source: window.location.pathname }) })
      setSt(r.ok ? 'done' : 'error')
    } catch { setSt('error') }
  }
  return (
    <div className="news" data-big={big || undefined}>
      <div className="news-copy">
        {big ? <h2>Nigerian tax changes and filing dates, once a month.</h2> : <h3>Newsletter</h3>}
        <p>One email a month on Nigerian tax changes and filing dates.</p>
      </div>
      {st === 'done' ? (
        <p className="news-ok" role="status"><Check size={18} /><span>Thank you, {name.trim().split(' ')[0]}. You are subscribed, and the next one comes to {email.trim()}.{!URL && <em> Preview only: nothing was saved.</em>}</span></p>
      ) : (
        <form className="news-form" onSubmit={send} noValidate>
          <label htmlFor={`${id}-name`} className="sr">Your name</label>
          <input id={`${id}-name`} type="text" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => { setName(e.target.value); if (st !== 'idle') setSt('idle') }} aria-invalid={st === 'noname'} aria-describedby={`${id}-msg`} />
          <label htmlFor={id} className="sr">Email address</label>
          <input id={id} type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => { setEmail(e.target.value); if (st !== 'idle') setSt('idle') }} aria-invalid={st === 'bad'} aria-describedby={`${id}-msg`} />
          <button className="btn btn-primary" disabled={st === 'busy'}>{st === 'busy' ? 'Subscribing' : 'Subscribe'}<ArrowRight size={16} /></button>
          <span id={`${id}-msg`} className="news-msg" role="alert">{st === 'noname' ? 'Enter your name.' : st === 'bad' ? 'Enter a valid email address.' : st === 'error' ? 'That did not go through. Please try again.' : ''}</span>
        </form>
      )}
    </div>
  )
}
