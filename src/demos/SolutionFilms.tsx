'use client'
import { Home, Receipt, CreditCard, FileText, BookOpen, Percent, Folder } from 'lucide-react'
import { Stage, Window, Count, States, Badge, Button, Spinner, Check, type Act } from '../kit'
import { asset } from '../lib/asset'
import './hero-film.css'
import './sol-film.css'

// One film per solution page, each played on the product screen that does the job the page describes.

const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const REST = { wide: { x: 880, y: 480 }, compact: { x: 300, y: 440 } }
const SIZE = { width: 1040, height: 560, compact: { below: 700, width: 358, height: 500 } }
type Busy = 'idle' | 'busy' | 'done'

function Shell({ title, url, parent, sub, layout, children }: { title: string; url: string; parent: 'Accounting' | 'Tax returns'; sub: string; layout: 'wide' | 'compact'; children: React.ReactNode }) {
  const nav = (label: string, icon: React.ReactNode) => (
    <>
      <div className="hf-nav">{icon}<span>{label}</span></div>
      {label === parent && <div className="hf-nav hf-sub" data-on><span>{sub}</span></div>}
    </>
  )
  return (
    <>
      <Window url={`app.taxstreem.com/${url}`} className="hf-win">
        <div className="hf-app">
          <aside className="hf-side">
            <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" className="hf-logo" />
            <span className="hf-cap">MENU</span>
            {nav('Home', <Home size={15} />)}{nav('Billing', <Receipt size={15} />)}{nav('Payments', <CreditCard size={15} />)}{nav('Purchases', <FileText size={15} />)}
            {nav('Accounting', <BookOpen size={15} />)}{nav('Tax returns', <Percent size={15} />)}{nav('Documents', <Folder size={15} />)}
            <div className="hf-org"><i>ED</i><span><b>Elysium Design Studio Ltd</b><em>Owner</em></span></div>
          </aside>
          <main className="hf-main">
            <header className="hf-top"><b>{title}</b></header>
            <section className="hf-scene" data-on>{children}</section>
          </main>
        </div>
      </Window>
      <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
    </>
  )
}

/* 1. Input VAT recovery: supplier invoices checked and claimed in the month they are paid. */
const VIN: [string, string, number][] = [['Emberline Software Limited', 'INV-2041', 225000], ['Lekki Print Hub', 'INV-0388', 112500], ['Total Energies', 'RCT-7731', 75000]]
type V = { claimed: number; added: boolean }
async function vatScript(a: Act<V>) {
  await a.wait(900)
  for (let i = 1; i <= 3; i++) { await a.set({ claimed: i }); await a.wait(720) }
  await a.wait(400); await a.move('add'); await a.wait(180); await a.click(); await a.set({ added: true })
  await a.move('rest'); await a.wait(3600); await a.set({ claimed: 0, added: false }); await a.wait(500)
}
export function VatClaimFilm() {
  return (
    <Stage<V> {...SIZE} initial={{ claimed: 0, added: false }} poster={{ claimed: 3, added: true }} script={vatScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf">
      {(s, _r, layout) => {
        const sum = VIN.slice(0, s.claimed).reduce((n, r) => n + r[2], 0)
        return (
          <Shell title="VAT" url="tax/vat/input" parent="Tax returns" sub="VAT" layout={layout}>
            <div className="hf-tiles">
              <div className="hf-tile" data-live={s.claimed > 0 || undefined}><span>Claimed this month</span><b><Count value={sum} format={naira} /></b><em>input VAT on bills paid in full</em></div>
              <div className="hf-tile"><span>Waiting for payment</span><b>{naira(86000)}</b><em>claimed once the bill is paid</em></div>
              <div className="hf-tile hf-pay"><span>VAT to pay</span><b><Count value={1125000 - sum} format={naira} /></b><em>October 2026</em></div>
            </div>
            <div className="hf-bankh"><span className="hf-body"><b>Input VAT invoices</b><i>October 2026 · each one traced to its supplier invoice</i></span>
              <span className="hf-act" data-target="add" data-cursor="hand"><States value={s.added ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary">Add to VAT return</Button>, y: <Badge tone="success" icon={<Check on size={12} />}>In the October return</Badge> }} /></span>
            </div>
            <div className="hf-card hf-tbl">
              <div className="hf-tr hf-th"><span>Supplier invoice</span><span>Input VAT</span><span>Status</span><span /></div>
              {VIN.map(([n, inv, v], i) => (
                <div key={inv} className="hf-tr" data-on={s.claimed > i || undefined}><span><b>{n}</b> <i className="sf-ref">{inv}</i></span><span>{naira(v)}</span><span className="hf-to">{s.claimed > i ? 'Tax ID valid · claimed' : 'Checking Tax ID with NRS'}</span><Check on={s.claimed > i} pending={s.claimed === i} size={16} /></div>
              ))}
              <div className="hf-tr sf-wait"><span><b>Harbour Logistics</b> <i className="sf-ref">INV-119</i></span><span>{naira(86000)}</span><span className="hf-to">Part paid · waiting</span><i className="sf-dot" /></div>
            </div>
          </Shell>
        )
      }}
    </Stage>
  )
}

/* 2. Refunds and credits: a short payment recognised as WHT and carried into the income tax computation. */
type C = { checks: number; rec: boolean; applied: boolean }
const CCHECK = ['Short by exactly 5% of the invoice', 'Matches the WHT rate for this service', 'Credit note requested from the customer']
async function creditScript(a: Act<C>) {
  await a.wait(900)
  for (let i = 1; i <= 3; i++) { await a.set({ checks: i }); await a.wait(560) }
  await a.wait(350); await a.move('record'); await a.wait(180); await a.click(); await a.set({ rec: true })
  await a.wait(1500); await a.set({ applied: true })
  await a.move('rest'); await a.wait(3600); await a.set({ checks: 0, rec: false, applied: false }); await a.wait(500)
}
export function WhtCreditFilm() {
  return (
    <Stage<C> {...SIZE} initial={{ checks: 0, rec: false, applied: false }} poster={{ checks: 3, rec: true, applied: true }} script={creditScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf sf-credits">
      {(s, _r, layout) => (
        <Shell title="Withholding tax" url="tax/wht/credits" parent="Tax returns" sub="Withholding tax" layout={layout}>
          <div className="hf-card hf-bill">
            <div className="hf-bill-h"><span className="hf-doc" aria-hidden /><span className="hf-body"><b>Adaeze Foods Limited paid {naira(950000)}</b><i>against INV-00412 for {naira(1000000)} · 28 Oct 2026</i></span><span className="hf-amt sf-short">−{naira(50000)}</span></div>
            <div className="hf-bill-b">
              <ul className="hf-checks">{CCHECK.map((c, i) => <li key={c} data-on={s.checks > i || undefined}><Check on={s.checks > i} pending={s.checks === i} size={16} /><span>{c}</span></li>)}</ul>
              <div className="hf-sum">
                <div><span>Received</span><b>{naira(950000)}</b></div>
                <div data-live={s.checks >= 3 || undefined}><span>WHT deducted, 5%</span><b>{naira(50000)}</b></div>
                <span className="hf-act" data-target="record" data-cursor="hand"><States value={s.rec ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary" size="large">Record WHT credit</Button>, y: <Badge tone="success" icon={<Check on size={13} />}>Invoice settled · credit recorded</Badge> }} /></span>
              </div>
            </div>
          </div>
          <div className="hf-tiles">
            <div className="hf-tile" data-live={s.rec || undefined}><span>WHT credits, 2026</span><b><Count value={s.rec ? 386500 : 336500} format={naira} /></b><em>across 6 customers</em></div>
            <div className="hf-tile"><span>Credit notes received</span><b>7 of {s.rec ? 10 : 9}</b><em>the rest requested</em></div>
            <div className="hf-tile hf-pay"><span>Set against income tax</span><b><Count value={s.applied ? 386500 : 0} format={naira} /></b><em>2026 CIT computation</em></div>
          </div>
        </Shell>
      )}
    </Stage>
  )
}

/* 3. Books lenders accept: IFRS statements built from the ledger and exported. */
type B = { tab: 'pl' | 'fp'; lines: number; exp: Busy }
const PL: [string, string, boolean?][] = [['Revenue', naira(48600000)], ['Cost of sales', `(${naira(21870000)})`], ['Gross profit', naira(26730000), true], ['Operating expenses', `(${naira(14205000)})`], ['Profit before tax', naira(12525000), true]]
const FP: [string, string, boolean?][] = [['Total assets', naira(31480000), true], ['Total liabilities', naira(9915000)], ['Equity', naira(21565000)], ['Liabilities and equity', naira(31480000), true]]
async function booksScript(a: Act<B>) {
  await a.wait(700)
  for (let i = 1; i <= 5; i++) { await a.set({ lines: i }); await a.wait(380) }
  await a.wait(900); await a.move('tab-fp'); await a.wait(160); await a.click(); await a.set({ tab: 'fp', lines: 0 })
  for (let i = 1; i <= 5; i++) { await a.wait(380); await a.set({ lines: i }) }
  await a.wait(700); await a.move('export'); await a.wait(160); await a.click(); await a.set({ exp: 'busy' }); await a.wait(1200); await a.set({ exp: 'done' })
  await a.move('rest'); await a.wait(3600); await a.set({ tab: 'pl', lines: 0, exp: 'idle' }); await a.wait(500)
}
export function StatementsFilm() {
  return (
    <Stage<B> {...SIZE} initial={{ tab: 'pl', lines: 0, exp: 'idle' }} poster={{ tab: 'fp', lines: 5, exp: 'done' }} script={booksScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf">
      {(s, _r, layout) => {
        const rows = s.tab === 'pl' ? PL : FP
        return (
          <Shell title="Financial statements" url="accounting/statements" parent="Accounting" sub="Financial statements" layout={layout}>
            <div className="hf-bankh">
              <div className="hf-pills"><i data-on={s.tab === 'pl' || undefined}>Profit or loss</i><i data-on={s.tab === 'fp' || undefined} data-target="tab-fp" data-cursor="hand">Financial position</i><i>Cash flows</i></div>
              <span className="hf-count">IFRS · year to 31 Oct 2026</span>
              <span className="hf-act" data-target="export" data-cursor="hand"><States value={s.exp} align="end" states={{ idle: <Button variant="primary">Export pack</Button>, busy: <Button variant="primary" icon={<Spinner size={12} />}>Preparing</Button>, done: <Badge tone="success" icon={<Check on size={12} />}>PDF, Word and Excel saved</Badge> }} /></span>
            </div>
            <div className="hf-card hf-tbl sf-stmt">
              <div className="hf-tr hf-th"><span>{s.tab === 'pl' ? 'Statement of profit or loss' : 'Statement of financial position'}</span><span>NGN</span></div>
              {rows.map(([l, v, strong], i) => <div key={s.tab + l} className="hf-tr" data-strong={strong || undefined} data-off={s.lines <= i || undefined}><span>{l}</span><span>{v}</span></div>)}
              <div className="hf-tr sf-foot" data-off={s.lines < 5 || undefined}><Check on={s.lines >= 5} size={16} /><span>{s.tab === 'pl' ? 'Every figure opens the entries and documents behind it' : 'Assets equal liabilities plus equity'}</span></div>
            </div>
          </Shell>
        )
      }}
    </Stage>
  )
}

/* 4. Filing on time: each return prepared from the ledger, then filed and receipted. */
type F = { vat: Busy; wht: Busy }
async function fileScript(a: Act<F>) {
  await a.wait(1000)
  await a.move('file-vat'); await a.wait(180); await a.click(); await a.set({ vat: 'busy' }); await a.wait(1300); await a.set({ vat: 'done' })
  await a.wait(500); await a.move('file-wht'); await a.wait(180); await a.click(); await a.set({ wht: 'busy' }); await a.wait(1300); await a.set({ wht: 'done' })
  await a.move('rest'); await a.wait(3800); await a.set({ vat: 'idle', wht: 'idle' }); await a.wait(500)
}
export function ReturnsFilm() {
  return (
    <Stage<F> {...SIZE} initial={{ vat: 'idle', wht: 'idle' }} poster={{ vat: 'done', wht: 'done' }} script={fileScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf">
      {(s, _r, layout) => {
        const done = (s.vat === 'done' ? 1 : 0) + (s.wht === 'done' ? 1 : 0)
        const row = (name: string, period: string, due: string, st: Busy, target: string, portal: string) => (
          <div className="hf-tr" data-on={st === 'done' || undefined}><span><b>{name}</b> <i className="sf-ref">{period}</i></span><span>{due}</span>
            <span><States value={st} align="start" states={{ idle: <Badge>Prepared from your books</Badge>, busy: <Badge icon={<Spinner size={11} />}>Filing on the {portal} portal</Badge>, done: <Badge tone="success" icon={<Check on size={12} />}>Filed · receipt saved</Badge> }} /></span>
            <span className="hf-act" data-target={target} data-cursor="hand"><States value={st} align="end" states={{ idle: <Button variant="primary">File</Button>, busy: <Button variant="primary" icon={<Spinner size={12} />}>Filing</Button>, done: <span className="hf-rcpt">On time</span> }} /></span></div>
        )
        return (
          <Shell title="Tax returns" url="tax/returns" parent="Tax returns" sub="All returns" layout={layout}>
            <div className="hf-tiles">
              <div className="hf-tile" data-live={done > 0 || undefined}><span>Due this month</span><b><Count value={2 - done} /></b><em>VAT and WHT, by 21 November</em></div>
              <div className="hf-tile"><span>Filed on time, 2026</span><b><Count value={19 + done} /> of 21</b><em>every receipt kept with its return</em></div>
              <div className="hf-tile hf-pay"><span>Next deadline</span><b>{done === 2 ? '21 Dec' : '21 Nov'}</b><em>{done === 2 ? 'November VAT and WHT' : 'October VAT and WHT'}</em></div>
            </div>
            <div className="hf-card hf-tbl hf-vat sf-returns">
              <div className="hf-tr hf-th"><span>Return</span><span>Due</span><span>Status</span><span /></div>
              {row('VAT', 'October 2026', '21 Nov', s.vat, 'file-vat', 'NRS')}
              {row('Withholding tax', 'October 2026', '21 Nov', s.wht, 'file-wht', 'NRS')}
              <div className="hf-tr"><span><b>Companies Income Tax</b> <i className="sf-ref">2026</i></span><span>30 Jun 2027</span><span><Badge>Building from the ledger</Badge></span><span /></div>
              <div className="hf-tr"><span><b>Personal Income Tax</b> <i className="sf-ref">owners, 2026</i></span><span>31 Mar 2027</span><span><Badge>Opens in January</Badge></span><span /></div>
            </div>
          </Shell>
        )
      }}
    </Stage>
  )
}

/* 5. Finance teams: the month closes from a checklist the software has mostly finished. */
type T = { steps: number; answered: boolean; closed: boolean }
const CLOSE: [string, string][] = [['Bank lines matched', '214 of 214, matched for you'], ['Bills and invoices posted', '86 posted, none waiting'], ['Questions from Atlas', ''], ['VAT and WHT returns', 'Filed, receipts saved']]
async function closeScript(a: Act<T>) {
  await a.wait(800)
  await a.set({ steps: 1 }); await a.wait(600); await a.set({ steps: 2 }); await a.wait(700)
  await a.move('answer'); await a.wait(180); await a.click(); await a.set({ answered: true, steps: 3 }); await a.wait(600); await a.set({ steps: 4 })
  await a.wait(600); await a.move('close'); await a.wait(180); await a.click(); await a.set({ closed: true })
  await a.move('rest'); await a.wait(3800); await a.set({ steps: 0, answered: false, closed: false }); await a.wait(500)
}
export function CloseFilm() {
  return (
    <Stage<T> {...SIZE} initial={{ steps: 0, answered: false, closed: false }} poster={{ steps: 4, answered: true, closed: true }} script={closeScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf">
      {(s, _r, layout) => (
        <Shell title="Period close" url="accounting/close" parent="Accounting" sub="Period close" layout={layout}>
          <div className="hf-bankh"><span className="hf-body"><b>October 2026</b><i>Everything the month needs before it locks</i></span>
            <span className="hf-count"><Count value={s.steps} /> of 4 done</span>
            <span className="hf-act" data-target="close" data-cursor="hand"><States value={s.closed ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary" style={{ opacity: s.steps < 4 ? 0.45 : 1 }}>Close October</Button>, y: <Badge tone="success" icon={<Check on size={12} />}>October locked</Badge> }} /></span>
          </div>
          <div className="hf-card hf-tbl sf-close">
            {CLOSE.map(([n, d], i) => (
              <div key={n} className="hf-tr" data-on={s.steps > i || undefined}>
                <Check on={s.steps > i} pending={s.steps === i} size={16} />
                <span><b>{n}</b></span>
                <span className="hf-to">{i === 2 ? (s.answered ? 'All answered' : '1 left: what was ₦150,000 to Total Energies for?') : d}</span>
                <span className="hf-act" data-target={i === 2 ? 'answer' : undefined} data-cursor={i === 2 ? 'hand' : undefined}>{i === 2 && !s.answered ? <Button>Diesel, 71% sure</Button> : <span className="hf-rcpt">{i === 0 || i === 1 ? 'Done for you' : s.steps > i ? 'Done' : ''}</span>}</span>
              </div>
            ))}
          </div>
          <div className="hf-card hf-ack" data-show={s.closed || undefined}><Check on={s.closed} size={18} /><span className="hf-body"><b>The month is locked and the CFO pack is ready</b><i>Statements, ledgers and tax schedules for October, with one question asked of the team</i></span></div>
        </Shell>
      )}
    </Stage>
  )
}

/* 6. Reconciliation: money received, sales recorded and stock out brought into agreement. */
type R = { m: number; fixed: boolean }
const REC: [string, string, string][] = [['Moniepoint POS settlement', '+' + naira(1284000), 'Till sales, 3 Nov'], ['Paystack payout', '+' + naira(322500), 'Invoice INV-00413'], ['Stock out, 3 Nov', '148 items', '148 items sold at the till']]
async function reconScript(a: Act<R>) {
  await a.wait(900)
  for (let i = 1; i <= 3; i++) { await a.set({ m: i }); await a.wait(620) }
  await a.wait(500); await a.move('accept'); await a.wait(180); await a.click(); await a.set({ fixed: true })
  await a.move('rest'); await a.wait(3800); await a.set({ m: 0, fixed: false }); await a.wait(500)
}
export function ReconFilm() {
  return (
    <Stage<R> {...SIZE} initial={{ m: 0, fixed: false }} poster={{ m: 3, fixed: true }} script={reconScript} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf">
      {(s, _r, layout) => (
        <Shell title="Banking" url="accounting/banking/reconcile" parent="Accounting" sub="Banking" layout={layout}>
          <div className="hf-tiles">
            <div className="hf-tile"><span>Money received</span><b>{naira(2340500)}</b><em>bank, POS and wallets</em></div>
            <div className="hf-tile" data-live={s.fixed || undefined}><span>Sales recorded</span><b><Count value={s.fixed ? 2340500 : 2322000} format={naira} /></b><em>invoices and till sales</em></div>
            <div className="hf-tile hf-pay"><span>Difference</span><b><Count value={s.fixed ? 0 : 18500} format={naira} /></b><em>{s.fixed ? 'money, sales and stock agree' : '1 line to explain'}</em></div>
          </div>
          <div className="hf-card hf-tbl sf-recon">
            <div className="hf-tr hf-th"><span>Record</span><span>Amount</span><span>Matched to</span><span /></div>
            {REC.map(([n, amt, to], i) => <div key={n} className="hf-tr" data-on={s.m > i || undefined}><span><b>{n}</b></span><span>{amt}</span><span className="hf-to">{to}</span><Check on={s.m > i} pending={s.m === i} size={16} /></div>)}
            <div className="hf-tr sf-odd" data-on={s.fixed || undefined}><span><b>GTBank transfer in</b></span><span>+{naira(18500)}</span><span className="hf-to">{s.fixed ? 'Deposit on INV-00419' : 'Likely a deposit on INV-00419'}</span>
              <span className="hf-act" data-target="accept" data-cursor="hand"><States value={s.fixed ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary">Accept</Button>, y: <Check on size={16} /> }} /></span></div>
          </div>
        </Shell>
      )}
    </Stage>
  )
}
