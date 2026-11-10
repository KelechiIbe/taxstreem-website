'use client'
import { Stage, Count, Collapse, States, Badge, Spinner, Check, Bar, type Act } from '../kit'
import { asset } from '../lib/asset'
import './mini.css'

const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const common = { accent: '#0072F5', greys: 'cool' as const }

/* 1. Connect: accounts link up one after another */
type C = { on: number; lines: number }
const BANKS = [['GTBank', 'Current ••4410', 'mono'], ['Paystack', 'Collections', 'paystack'], ['Moniepoint', 'POS terminals', 'moniepoint']] as const
export function ConnectFilm() {
  const script = async (a: Act<C>) => {
    await a.wait(500)
    for (let i = 1; i <= 3; i++) { await a.set({ on: i }); await a.wait(650) }
    await a.set({ lines: 214 })
    await a.wait(3200)
    await a.set({ on: 0, lines: 0 })
    await a.wait(400)
  }
  return (
    <Stage<C> width={380} height={250} initial={{ on: 0, lines: 0 }} poster={{ on: 3, lines: 214 }} script={script} {...common} className="mf">
      {(s) => (
        <div className="mf-card">
          <div className="mf-h">Connected accounts<span><Count value={s.lines} /> lines read</span></div>
          {BANKS.map(([n, d, logo], i) => (
            <div key={n} className="mf-row" data-on={s.on > i || undefined}>
              <span className="mf-logo"><img src={asset(`/partners/${logo}.png`)} alt="" /></span>
              <span className="mf-body"><b>{n}</b><i>{d}</i></span>
              <States value={s.on > i ? 'on' : 'off'} align="end" states={{ off: <Badge icon={<Spinner size={11} />}>Linking</Badge>, on: <Badge tone="success" icon={<Check on size={12} />}>Connected</Badge> }} />
            </div>
          ))}
        </div>
      )}
    </Stage>
  )
}

/* 2. Review: Atlas asks one question, the cursor answers it */
type R = { pick: boolean; posted: boolean }
export function ReviewFilm() {
  const script = async (a: Act<R>) => {
    await a.wait(1100)
    await a.move('opt')
    await a.wait(200)
    await a.click()
    await a.set({ pick: true })
    await a.wait(500)
    await a.move('post')
    await a.click()
    await a.set({ posted: true })
    await a.move({ x: 200, y: 150 })
    await a.wait(3000)
    await a.set({ pick: false, posted: false })
    await a.wait(400)
  }
  return (
    <Stage<R> width={380} height={250} initial={{ pick: false, posted: false }} poster={{ pick: true, posted: true }} script={script} cursor={{ at: { x: 200, y: 150 } }} {...common} className="mf">
      {(s) => (
        <div className="mf-card">
          <div className="mf-h">One question from Atlas<span>1 of 214 lines</span></div>
          <p className="mf-q">What was {naira(150000)} to Total Energies for?</p>
          <div className="mf-opt" data-target="opt" data-cursor="hand" data-on={s.pick || undefined}><i /><span><b>Diesel &amp; generator fuel</b><em>Best guess · 71% sure</em></span></div>
          <div className="mf-opt"><i /><span><b>Vehicle running costs</b></span></div>
          <div className="mf-foot">
            <span className="mf-dim">213 lines posted without asking</span>
            <span data-target="post" data-cursor="hand">
              <States value={s.posted ? 'done' : 'go'} align="end" states={{ go: <span className="mf-btn" data-off={!s.pick || undefined}>Post</span>, done: <Badge tone="success" icon={<Check on size={12} />}>Posted</Badge> }} />
            </span>
          </div>
        </div>
      )}
    </Stage>
  )
}

/* 3. File: the return goes to the NRS and the receipt comes back */
type F = { n: number; state: 'ready' | 'busy' | 'done' }
const LINES = ['Output VAT from 14 invoices', 'Input VAT from 9 supplier bills', 'Return completed on the NRS portal']
export function FileFilm() {
  const script = async (a: Act<F>) => {
    await a.wait(500)
    await a.set({ state: 'busy' })
    for (let i = 1; i <= 3; i++) { await a.set({ n: i }); await a.wait(700) }
    await a.set({ state: 'done' })
    await a.wait(3400)
    await a.set({ n: 0, state: 'ready' })
    await a.wait(400)
  }
  return (
    <Stage<F> width={380} height={250} initial={{ n: 0, state: 'ready' }} poster={{ n: 3, state: 'done' }} script={script} {...common} className="mf">
      {(s) => (
        <div className="mf-card">
          <div className="mf-h">VAT return · October<span>{naira(685674)}</span></div>
          {LINES.map((l, i) => (
            <div key={l} className="mf-line"><Check on={s.n > i} pending={s.state === 'busy' && s.n === i} size={16} /><span data-on={s.n > i || undefined}>{l}</span></div>
          ))}
          <div className="mf-foot">
            <span className="mf-dim">Due 21 November</span>
            <States value={s.state} align="end" states={{ ready: <span className="mf-btn">File return</span>, busy: <Badge icon={<Spinner size={11} />}>Filing with NRS</Badge>, done: <Badge tone="success" icon={<Check on size={12} />}>Filed · receipt saved</Badge> }} />
          </div>
        </div>
      )}
    </Stage>
  )
}

/* 4. E-invoice: validated by the NRS, stamped, delivered */
type E = { state: 'draft' | 'sending' | 'valid'; irn: string; qr: boolean; sent: boolean }
const IRN = 'INV00412-7C4E91A2-20261110'
export function EInvoiceFilm() {
  const init: E = { state: 'draft', irn: '', qr: false, sent: false }
  const script = async (a: Act<E>) => {
    await a.wait(900)
    await a.set({ state: 'sending' })
    await a.wait(1300)
    await a.set({ state: 'valid' })
    await a.type('irn', IRN, { interval: 28 })
    await a.set({ qr: true })
    await a.wait(900)
    await a.set({ sent: true })
    await a.wait(3400)
    await a.set(init)
    await a.wait(400)
  }
  return (
    <Stage<E> width={440} height={300} initial={init} poster={{ state: 'valid', irn: IRN, qr: true, sent: true }} script={script} {...common} className="mf mf-inv">
      {(s) => (
        <>
          <div className="mf-paper">
            <div className="mf-ph"><img src={asset('/brand/taxstreem-icon-blue.svg')} alt="" /><span><b>Tax invoice</b><i>Elysium Design Studio Ltd</i></span>
              <States value={s.state} align="end" states={{ draft: <Badge>Draft</Badge>, sending: <Badge tone="accent" icon={<Spinner size={11} />}>Sending to NRS</Badge>, valid: <Badge tone="success" icon={<Check on size={12} />}>Validated by NRS</Badge> }} />
            </div>
            <div className="mf-pl"><span>Brand strategy retainer</span><b>{naira(850000)}</b></div>
            <div className="mf-pl"><span>VAT at 7.5%</span><b>{naira(63750)}</b></div>
            <div className="mf-pl mf-total"><span>Total</span><b>{naira(913750)}</b></div>
            <div className="mf-irn"><span><em>Invoice Reference Number</em><code>{s.irn || ' '}</code></span><i className="mf-qr" data-show={s.qr || undefined} /></div>
          </div>
          <div className="mf-toast" data-show={s.sent || undefined}><img src={asset('/partners/whatsapp.png')} alt="" /><span><b>Delivered to Adaeze Foods</b><i>with a payment link</i></span></div>
        </>
      )}
    </Stage>
  )
}

/* 5. Inventory: the day's count finds the leak */
type I = { counting: boolean; counted: boolean; leak: number; told: boolean }
export function InventoryFilm() {
  const init: I = { counting: false, counted: false, leak: 184000, told: false }
  const script = async (a: Act<I>) => {
    await a.wait(1000)
    await a.move('count')
    await a.click()
    await a.set({ counting: true })
    await a.wait(1500)
    await a.set({ counting: false, counted: true })
    await a.wait(500)
    await a.set({ leak: 203200 })
    await a.wait(900)
    await a.set({ told: true })
    await a.move({ x: 470, y: 380 })
    await a.wait(3400)
    await a.set(init)
    await a.wait(400)
  }
  return (
    <Stage<I> width={520} height={420} initial={init} poster={{ counting: false, counted: true, leak: 203200, told: true }} script={script} cursor={{ at: { x: 470, y: 380 } }} {...common} className="mf mf-stock">
      {(s) => (
        <div className="mf-card">
          <div className="mf-dark"><span>Stock loss · Ikeja branch · last 30 days</span><b>Leaking <Count value={s.leak} format={naira} /> a month</b></div>
          <div className="mf-cap">Count these next</div>
          <div className="mf-item">
            <span className="mf-body"><b>Receipt paper rolls</b><i>Sold 40, stock fell by 52</i></span>
            <span data-target="count" data-cursor="hand">
              <States value={s.counted ? 'done' : s.counting ? 'busy' : 'go'} align="end" states={{ go: <span className="mf-btn">Count</span>, busy: <Badge tone="accent" icon={<Spinner size={11} />}>Counting on phone</Badge>, done: <Badge tone="danger">12 short · {naira(19200)}</Badge> }} />
            </span>
          </div>
          <Collapse open={s.told} reveal="drop"><div className="mf-told"><img src={asset('/modules/martina-white.svg')} alt="" /><span>Martina told the branch manager and opened a recount for Friday.</span></div></Collapse>
          <div className="mf-item"><span className="mf-body"><b>50kg rice</b><i>Two price changes this quarter</i></span><span className="mf-btn mf-ghost">Count</span></div>
          <div className="mf-item"><span className="mf-body"><b>Phone chargers</b><i>Not counted for 21 days</i></span><span className="mf-btn mf-ghost">Count</span></div>
          <div className="mf-item" data-crop><span className="mf-body"><Bar w={120} h={8} tone={3} /><Bar w={160} h={6} tone={2} /></span><Bar w={54} h={26} r={8} tone={2} /></div>
        </div>
      )}
    </Stage>
  )
}
