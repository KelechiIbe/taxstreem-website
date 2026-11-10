'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { API, SENDS } from '../lib/api'

// What the visitor picks, and the role the admin portal files it under.
const WHO: [string, string][] = [['Business owner', 'Business owner'], ['Finance team', 'Finance team'], ['Tax professional', 'Tax professional'], ['Individual', 'Other'], ['Platform', 'Developer or platform']]
type St = 'idle' | 'busy' | 'done' | 'error'

/** Contact form. Posts to the same route the admin portal reads from. */
export function ContactForm() {
  const [who, setWho] = useState(0); const [st, setSt] = useState<St>('idle'); const [msg, setMsg] = useState(''); const [name, setName] = useState('')
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget; const f = new FormData(form)
    const phone = String(f.get('phone') || '').trim(); const text = String(f.get('message') || '').trim()
    const body = { fullName: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), company: String(f.get('company') || '').trim(), role: WHO[who][1], message: (phone ? `Phone or WhatsApp: ${phone}\n` : '') + (WHO[who][0] !== WHO[who][1] ? `I am: ${WHO[who][0]}\n` : '') + ((phone || WHO[who][0] !== WHO[who][1]) ? '\n' : '') + text, website: String(f.get('website') || '') }
    setName(body.fullName.split(' ')[0]); setMsg('')
    if (!SENDS) return setSt('done')
    setSt('busy')
    try {
      const r = await fetch(`${API}/contact/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (r.ok) { form.reset(); return setSt('done') }
      const j = await r.json().catch(() => null)
      setMsg(j?.message ?? (r.status === 429 ? 'Too many requests. Please wait a moment.' : 'That did not go through. Please try again.')); setSt('error')
    } catch { setMsg('That did not go through. Please try again.'); setSt('error') }
  }
  if (st === 'done') return (
    <div className="cform cform-done" role="status"><span><Check size={22} /></span><h2>Thank you{name ? `, ${name}` : ''}.</h2><p>Your message is with the team. We reply within one working day.{!SENDS && <em> Preview only: nothing was sent.</em>}</p><button type="button" className="btn btn-ghost" onClick={() => setSt('idle')}>Send another message</button></div>
  )
  return (
    <form className="cform" onSubmit={submit}>
      <label>Full name<input name="name" required autoComplete="name" /></label>
      <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Phone or WhatsApp<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>Company<input name="company" autoComplete="organization" /></label>
      <label className="cform-hp" aria-hidden>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <fieldset><legend>I am a</legend>{WHO.map(([w], i) => <button type="button" key={w} aria-pressed={who === i} onClick={() => setWho(i)}>{w}</button>)}</fieldset>
      <label className="wide">How can we help?<textarea name="message" rows={4} required /></label>
      <button className="btn btn-primary btn-lg" type="submit" disabled={st === 'busy'}>{st === 'busy' ? 'Sending' : 'Send message'}</button>
      {st === 'error' ? <p className="pfine cform-err" role="alert">{msg}</p> : <p className="pfine">We reply within one working day.</p>}
    </form>
  )
}
