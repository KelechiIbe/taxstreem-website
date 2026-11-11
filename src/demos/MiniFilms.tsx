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
              <span className="mf-logo"><img src={asset(`/partners/${logo}.webp`)} alt="" /></span>
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

/* 4. E-invoice: a real receipt signed by the NRS (RCT-000013, 5 Nov 2026) */
type E = { state: 'sent' | 'sending' | 'signed'; irn: string; qr: boolean; sent: boolean }
const IRN = 'RCT000013-4F78F6A7-20261105'
export function EInvoiceFilm() {
  const init: E = { state: 'sent', irn: '', qr: false, sent: false }
  const script = async (a: Act<E>) => {
    await a.wait(900)
    await a.set({ state: 'sending' })
    await a.wait(1400)
    await a.set({ state: 'signed' })
    await a.wait(350)
    await a.set({ qr: true })
    await a.type('irn', IRN, { interval: 26 })
    await a.wait(900)
    await a.set({ sent: true })
    await a.wait(3800)
    await a.set(init)
    await a.wait(400)
  }
  return (
    <Stage<E> width={460} height={376} initial={init} poster={{ state: 'signed', irn: IRN, qr: true, sent: true }} script={script} {...common} className="mf mf-inv">
      {(s) => (
        <>
          <div className="mf-paper">
            <div className="mf-ph"><span><b>Receipt RCT-000013</b><i>Walk-in customer · 05 Nov 2026</i></span>
              <States value={s.state} align="end" states={{ sent: <Badge tone="success">Paid</Badge>, sending: <Badge tone="accent" icon={<Spinner size={11} />}>Sending to NRS</Badge>, signed: <Badge tone="success" icon={<Check on size={12} />}>Signed by NRS</Badge> }} />
            </div>
            <Collapse open={s.state === 'signed'} reveal="drop"><div className="mf-signed"><Check on size={14} /> Signed by NRS 05 Nov · 12:05. NRS knows it is paid.</div></Collapse>
            <div className="mf-nrs">
              <span className="mf-qr" data-show={s.qr || undefined}><img src={asset('/brand/nrs-signed-qr.png')} alt="QR code of an e-invoice signed by the NRS" /><i /></span>
              <span className="mf-nrs-t"><b>NRS e-invoice, signed by NRS</b><code>IRN {s.irn || ' '}</code><em>Scan with NRS&rsquo;s MBS 360 app to check it.</em></span>
            </div>
            <div className="mf-pl"><span>Eva Water 75cl · 3 × {naira(250)}</span><b>{naira(750)}</b></div>
            <div className="mf-pl"><span>VAT · zero-rated</span><b>{naira(0)}</b></div>
            <div className="mf-pl mf-total"><span>Total paid</span><b>{naira(750)}</b></div>
          </div>
          <div className="mf-toast" data-show={s.sent || undefined}><img src={asset('/partners/whatsapp.webp')} alt="" /><span><b>Customer&rsquo;s copy sent</b><i>on WhatsApp, with the QR code</i></span></div>
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

/* 6. Personal Income Tax: the return works itself out, in the product's own black-and-white screens. Figures are invented. */
type P = { step: number; income: number; reliefs: boolean; tax: number; state: 'go' | 'busy' | 'done' }
const PSTEPS = ['About you', 'Income', 'Reliefs', 'Review', 'Pay & file']
export function PitFilm() {
  const init: P = { step: 1, income: 0, reliefs: false, tax: 0, state: 'go' }
  const script = async (a: Act<P>) => {
    await a.wait(800)
    await a.set({ income: 8400000 })
    await a.wait(1400)
    await a.set({ step: 2, reliefs: true })
    await a.wait(1300)
    await a.set({ step: 3, tax: 1094640 })
    await a.wait(1500)
    await a.set({ step: 4, state: 'busy' })
    await a.wait(1300)
    await a.set({ state: 'done' })
    await a.wait(3600)
    await a.set(init)
    await a.wait(400)
  }
  return (
    <Stage<P> width={520} height={480} initial={init} poster={{ step: 4, income: 8400000, reliefs: true, tax: 1094640, state: 'done' }} script={script} accent="#111111" className="mf mf-pit">
      {(s) => (
        <div className="mf-card">
          <div className="pit-hero">
            <span>2026 return · autosaved</span>
            <b>Your return is <Count value={[19, 40, 62, 84, 100][s.state === 'done' ? 4 : s.step - 1 + (s.income ? 1 : 0)] ?? 100} />% done.</b>
            <div className="pit-steps">{PSTEPS.map((p, i) => <i key={p} data-on={i <= s.step || undefined}><em>{p}</em></i>)}</div>
          </div>
          <div className="pit-row"><span>Income from 3 sources</span><b><Count value={s.income} format={naira} /></b></div>
          <div className="pit-row" data-dim={!s.reliefs || undefined}><span>Pension contribution, 8%</span><b>{s.reliefs ? '−' + naira(672000) : '—'}</b></div>
          <div className="pit-row" data-dim={!s.reliefs || undefined}><span>Rent relief, 20% of rent paid</span><b>{s.reliefs ? '−' + naira(480000) : '—'}</b></div>
          <div className="pit-row pit-total"><span>Tax for the year</span><b><Count value={s.tax} format={naira} /></b></div>
          <div className="mf-foot">
            <span className="mf-dim">File by 31 March 2027 · LIRS</span>
            <States value={s.state} align="end" states={{ go: <span className="mf-btn pit-btn">Review and file</span>, busy: <Badge icon={<Spinner size={11} />}>Filing with LIRS</Badge>, done: <Badge tone="success" icon={<Check on size={12} />}>Filed · receipt saved</Badge> }} />
          </div>
        </div>
      )}
    </Stage>
  )
}

/* 7. Accountant portal: the Clients list works through the day's urgent items. Clients and figures are invented. */
type Q = { done: number }
const CLIENTS: [string, string, string, string][] = [
  ['Adaeze Foods Limited', 'VAT due in 3 days', 'Filed', '₦685,674'],
  ['Lekki Print Hub', '2 answers from client', 'Reviewed', '₦118,300'],
  ['Northgate Schools', '14 bank lines to match', 'Reconciled', '₦0'],
  ['Harbour Clinic', 'WHT schedule ready', 'Filed', '₦212,500'],
]
export function PortalFilm() {
  const script = async (a: Act<Q>) => {
    await a.wait(900)
    for (let i = 1; i <= 4; i++) { await a.set({ done: i }); await a.wait(950) }
    await a.wait(3000)
    await a.set({ done: 0 })
    await a.wait(400)
  }
  return (
    <Stage<Q> width={620} height={430} initial={{ done: 0 }} poster={{ done: 4 }} script={script} {...common} className="mf mf-portal">
      {(s) => (
        <div className="mf-card">
          <div className="mf-h">Clients<span>Okafor &amp; Bello Chartered Accountants · 12 businesses</span></div>
          <div className="po-tiles">
            <div><span>Due in 14 days</span><b><Count value={4 - Math.min(s.done, 4) + 3} /></b></div>
            <div><span>Answers from clients</span><b><Count value={s.done >= 2 ? 0 : 2} /></b></div>
            <div><span>Earned this month</span><b>{naira(184500)}</b></div>
          </div>
          <div className="po-th"><span>Client</span><span>Status</span><span>Liabilities</span></div>
          {CLIENTS.map(([n, todo, ok, amt], i) => (
            <div key={n} className="po-tr" data-on={s.done > i || undefined}>
              <span><b>{n}</b></span>
              <span><States value={s.done > i ? 'ok' : 'todo'} align="start" states={{ todo: <Badge tone={i === 0 ? 'warning' : 'neutral'} dot>{todo}</Badge>, ok: <Badge tone="success" icon={<Check on size={12} />}>{ok}</Badge> }} /></span>
              <span>{amt}</span>
            </div>
          ))}
          <div className="po-tr" data-crop><span><Bar w={150} h={8} tone={3} /></span><span><Bar w={110} h={18} r={9} tone={1} /></span><span><Bar w={60} h={8} tone={2} /></span></div>
        </div>
      )}
    </Stage>
  )
}
