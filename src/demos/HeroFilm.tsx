'use client'
import { Stage, Window, Bar, Text, Count, Collapse, States, Badge, Button, Spinner, Check, type Act } from '../kit'
import { asset } from '../lib/asset'
import './hero-film.css'

// The home page film: a supplier invoice arrives, its VAT is read, stock goes
// into a branch, the bank payment matches, the month's VAT return moves, and
// the return is filed with the NRS.

type S = {
  bill: boolean
  read: 'reading' | 'vat'
  stock: boolean
  matched: boolean
  input: number
  filing: 'idle' | 'busy' | 'done'
}

const OUTPUT = 1125000
const INPUT = 439326
const initial: S = { bill: false, read: 'reading', stock: false, matched: false, input: 0, filing: 'idle' }
const POSTER: S = { bill: true, read: 'vat', stock: true, matched: true, input: INPUT, filing: 'done' }
const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const REST = { wide: { x: 760, y: 430 }, compact: { x: 250, y: 400 } }

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('arrive')
  await a.set({ bill: true })
  await a.wait(1300)
  a.mark('vat')
  await a.set({ read: 'vat' })
  await a.wait(900)
  await a.set({ stock: true })
  await a.wait(900)
  a.mark('match')
  await a.set({ matched: true })
  await a.wait(700)
  a.mark('return')
  await a.set({ input: INPUT })
  await a.wait(1500)
  a.mark('file')
  await a.move('file')
  await a.wait(250)
  await a.click()
  await a.set({ filing: 'busy' })
  await a.wait(1300)
  await a.set({ filing: 'done' })
  await a.move('rest')
  await a.wait(3200)
  await a.set({ ...initial })
  await a.wait(500)
}

const NAV = ['Dashboard', 'Transactions', 'Accounting', 'Invoices', 'Tax returns']

export function HeroFilm() {
  return (
    <Stage<S>
      width={1040}
      height={540}
      compact={{ below: 700, width: 358, height: 470 }}
      initial={initial}
      poster={POSTER}
      script={script}
      accent="#0072F5"
      greys="cool"
      cursor={{ at: REST }}
      className="hf"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="app.taxstreem.com/tax-returns/vat" className="hf-win">
            <div className="hf-app">
              <aside className="hf-side">
                <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" className="hf-logo" />
                {NAV.map((n) => (
                  <div key={n} className="hf-nav" data-on={n === 'Tax returns' || undefined}>
                    <Bar w={14} h={14} r={4} tone={n === 'Tax returns' ? 5 : 3} />
                    <Text>{n}</Text>
                  </div>
                ))}
                <div className="hf-side-foot">
                  <Bar w={22} h={22} r={11} tone={3} />
                  <Bar w={72} h={7} tone={2} />
                </div>
              </aside>

              <main className="hf-main">
                <header className="hf-head">
                  <div>
                    <div className="hf-title">VAT return</div>
                    <div className="hf-sub">November 2026 · due 21 December</div>
                  </div>
                  <span className="hf-file" data-target="file" data-cursor="hand">
                    <States
                      value={s.filing}
                      align="end"
                      states={{
                        idle: <Button variant="primary" size="large">File return</Button>,
                        busy: (
                          <Button variant="primary" size="large" icon={<Spinner size={13} />}>
                            Filing with NRS
                          </Button>
                        ),
                        done: (
                          <Badge tone="success" icon={<Check on size={14} />} className="hf-filed">
                            Filed with NRS
                          </Badge>
                        ),
                      }}
                    />
                  </span>
                </header>

                <section className="hf-tiles">
                  <div className="hf-tile">
                    <span className="hf-label">Output VAT</span>
                    <span className="hf-num">{naira(OUTPUT)}</span>
                    <span className="hf-note">on 14 invoices</span>
                  </div>
                  <div className="hf-tile" data-live={s.input > 0 || undefined}>
                    <span className="hf-label">Input VAT</span>
                    <span className="hf-num">
                      <Count value={s.input} format={naira} />
                    </span>
                    <span className="hf-note">recovered from suppliers</span>
                  </div>
                  <div className="hf-tile hf-tile--pay">
                    <span className="hf-label">VAT to pay</span>
                    <span className="hf-num">
                      <Count value={OUTPUT - s.input} format={naira} />
                    </span>
                    <span className="hf-note">7.5% · NRS</span>
                  </div>
                </section>

                <section className="hf-cols">
                  <div className="hf-panel">
                    <div className="hf-panel-head">Supplier bills</div>
                    <Collapse open={s.bill} reveal="drop">
                      <div className="hf-row hf-row--new">
                        <span className="hf-doc" aria-hidden />
                        <span className="hf-row-body">
                          <span className="hf-row-title">Emberline Software</span>
                          <span className="hf-row-sub">INV-2041 · {naira(6297000)}</span>
                        </span>
                        <span className="hf-row-end">
                          <States
                            value={s.read}
                            align="end"
                            states={{
                              reading: <Badge icon={<Spinner size={11} />}>Reading invoice</Badge>,
                              vat: <Badge tone="accent">VAT {naira(INPUT)}</Badge>,
                            }}
                          />
                          <span className="hf-stock" data-show={s.stock || undefined}>
                            <Badge tone="neutral" dot>
                              {layout === 'compact' ? '12 into Ikeja' : '12 items into Ikeja branch'}
                            </Badge>
                          </span>
                        </span>
                      </div>
                    </Collapse>
                    <div className="hf-row">
                      <span className="hf-doc" aria-hidden />
                      <span className="hf-row-body">
                        <span className="hf-row-title">Kestrel Advisory Partners</span>
                        <span className="hf-row-sub">INV-0388 · {naira(6663)}</span>
                      </span>
                      <span className="hf-row-end">
                        <Badge tone="success">Paid</Badge>
                      </span>
                    </div>
                    <div className="hf-row hf-row--filler" data-crop>
                      <Bar w={18} h={22} r={4} tone={2} />
                      <span className="hf-row-body">
                        <Bar w={120} h={7} tone={3} />
                        <Bar w={84} h={6} tone={2} />
                      </span>
                      <Bar w={44} h={18} r={9} tone={1} />
                    </div>
                  </div>

                  <div className="hf-panel hf-panel--bank">
                    <div className="hf-panel-head">Bank · GTBank ••4410</div>
                    <div className="hf-bank" data-matched={s.matched || undefined}>
                      <span className="hf-row-body">
                        <span className="hf-row-title">Transfer to Emberline</span>
                        <span className="hf-row-sub">10 Nov · −{naira(6297000)}</span>
                      </span>
                      <span className="hf-match">
                        <Check on={s.matched} pending={s.bill} size={16} />
                        <States value={s.matched ? 'yes' : 'no'} align="start" states={{ no: <span className="hf-dim">Unmatched</span>, yes: <span className="hf-ok">Matched to bill</span> }} />
                      </span>
                    </div>
                    <div className="hf-bank hf-row--filler">
                      <span className="hf-row-body">
                        <Bar w={110} h={7} tone={3} />
                        <Bar w={70} h={6} tone={2} />
                      </span>
                      <Bar w={16} h={16} r={8} tone={2} />
                    </div>
                    <div className="hf-bank hf-row--filler" data-crop>
                      <span className="hf-row-body">
                        <Bar w={96} h={7} tone={3} />
                        <Bar w={60} h={6} tone={2} />
                      </span>
                      <Bar w={16} h={16} r={8} tone={2} />
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </Window>
          <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  )
}
