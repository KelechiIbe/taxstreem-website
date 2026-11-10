'use client'
import { Stage, Phone, Thread, Bubble, Stamp, type Act } from '../kit'
import { asset } from '../lib/asset'
import './martina.css'

// Martina on WhatsApp: she writes first about a shrinking margin, the owner
// asks who owes most, she lists them and offers to chase.

type S = { m1: boolean; q: boolean; typing: boolean; list: boolean; ask: boolean; yes: boolean; done: boolean }
const initial: S = { m1: false, q: false, typing: false, list: false, ask: false, yes: false, done: false }
const POSTER: S = { m1: true, q: true, typing: false, list: true, ask: true, yes: true, done: true }

async function script(a: Act<S>) {
  await a.wait(700)
  await a.set({ m1: true })
  await a.wait(2600)
  await a.set({ q: true })
  await a.wait(900)
  await a.set({ typing: true })
  await a.wait(1400)
  await a.set({ typing: false, list: true })
  await a.wait(2200)
  await a.set({ ask: true })
  await a.wait(1700)
  await a.set({ yes: true })
  await a.wait(1100)
  await a.set({ done: true })
  await a.wait(3600)
}

const OWED = [
  ['Adaeze Foods', '₦1,240,000', '47 days'],
  ['Lekki Print Hub', '₦680,000', '33 days'],
  ['Bola & Sons', '₦415,500', '31 days'],
]

export function MartinaChat() {
  return (
    <Stage<S> width={380} height={560} initial={initial} poster={POSTER} script={script} play="once" accent="#0072F5" className="mc">
      {(s) => (
        <Phone width={330} className="mc-phone" time="8:02">
          <div className="mc-app">
            <header className="mc-head">
              <span className="mc-avatar">
                <img src={asset('/modules/martina-white.svg')} alt="" />
              </span>
              <span className="mc-who">
                <b>Martina</b>
                <i>TaxStreem · online</i>
              </span>
            </header>
            <Thread app="sms" className="mc-thread">
              <Stamp>
                <b>Today</b> 8:02
              </Stamp>
              {s.m1 && (
                <Bubble from="them">
                  Good morning. Your margin on 50kg rice fell from 18% to 11% this month. Your supplier raised the price twice and your selling price stayed the same.
                </Bubble>
              )}
              {s.q && <Bubble from="me">Who owes me the most?</Bubble>}
              {(s.typing || s.list) && (
                <Bubble from="them" typing={s.typing}>
                  <span className="mc-list">
                    {OWED.map(([n, amt, d]) => (
                      <span key={n} className="mc-line">
                        <span>{n}</span>
                        <b>{amt}</b>
                        <i>{d}</i>
                      </span>
                    ))}
                  </span>
                </Bubble>
              )}
              {s.ask && <Bubble from="them">Shall I remind them today and call anyone who has not paid by Friday?</Bubble>}
              {s.yes && <Bubble from="me">Yes</Bubble>}
              {s.done && <Bubble from="them">Done. Three reminders sent with payment links.</Bubble>}
            </Thread>
          </div>
        </Phone>
      )}
    </Stage>
  )
}
