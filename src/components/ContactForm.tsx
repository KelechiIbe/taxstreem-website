'use client'
import { useState } from 'react'

const WHO = ['Business owner', 'Finance team', 'Tax professional', 'Individual', 'Platform']
export function ContactForm() {
  const [who, setWho] = useState(WHO[0])
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const body = `Name: ${f.get('name')}\nPhone or WhatsApp: ${f.get('phone')}\nCompany: ${f.get('company')}\nI am a: ${who}\n\n${f.get('message')}`
    window.location.href = `mailto:hello@taxstreem.com?subject=${encodeURIComponent('Website enquiry from ' + f.get('name'))}&body=${encodeURIComponent(body)}`
  }
  return (
    <form className="cform" onSubmit={submit}>
      <label>Full name<input name="name" required autoComplete="name" /></label>
      <label>Work email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Phone or WhatsApp<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>Company<input name="company" autoComplete="organization" /></label>
      <fieldset><legend>I am a</legend>{WHO.map((w) => <button type="button" key={w} aria-pressed={who === w} onClick={() => setWho(w)}>{w}</button>)}</fieldset>
      <label className="wide">How can we help?<textarea name="message" rows={4} required /></label>
      <button className="btn btn-primary btn-lg" type="submit">Send message</button>
      <p className="pfine">We reply within one working day.</p>
    </form>
  )
}
