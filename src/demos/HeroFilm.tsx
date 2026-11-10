'use client'
import { Home, Receipt, CreditCard, FileText, BookOpen, Percent, Folder } from 'lucide-react'
import { Stage, Window, Bar, Count, States, Badge, Button, Spinner, Check, type Act } from '../kit'
import { asset } from '../lib/asset'
import './hero-film.css'

// The home page film, played inside the product's own screens: a supplier
// bill is checked and approved, the bank lines reconcile against it, and the
// month's VAT return is filed with the NRS.

type Scene = 'bills' | 'bank' | 'vat'
type S = { scene: Scene; read: boolean; checks: number; approved: boolean; matched: number; input: number; filing: 'idle' | 'busy' | 'done' }
const OUTPUT = 1125000, INPUT = 439326
const initial: S = { scene: 'bills', read: false, checks: 0, approved: false, matched: 0, input: 0, filing: 'idle' }
const POSTER: S = { scene: 'vat', read: true, checks: 3, approved: true, matched: 3, input: INPUT, filing: 'done' }
const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const REST = { wide: { x: 880, y: 470 }, compact: { x: 300, y: 430 } }

async function script(a: Act<S>) {
  await a.wait(900)
  a.mark('read')
  await a.set({ read: true })
  for (let i = 1; i <= 3; i++) { await a.wait(520); await a.set({ checks: i }) }
  await a.wait(500)
  await a.move('approve'); await a.wait(180); await a.click()
  await a.set({ approved: true })
  await a.wait(1100)

  a.mark('bank')
  if (a.layout === 'wide') { await a.move('nav-bank'); await a.click() }
  await a.set({ scene: 'bank' })
  await a.wait(700)
  for (let i = 1; i <= 3; i++) { await a.set({ matched: i }); await a.wait(560) }
  await a.wait(700)

  a.mark('vat')
  if (a.layout === 'wide') { await a.move('nav-vat'); await a.click() }
  await a.set({ scene: 'vat' })
  await a.wait(600)
  await a.set({ input: INPUT })
  await a.wait(1300)
  await a.move('file'); await a.wait(200); await a.click()
  await a.set({ filing: 'busy' })
  await a.wait(1300)
  await a.set({ filing: 'done' })
  await a.move('rest')
  await a.wait(3400)
  await a.set({ ...initial })
  await a.wait(500)
}

const CHECKS = ['The sums on the invoice add up', 'This invoice number has not been paid before', 'The supplier’s Tax ID is valid with the NRS']
const BANK: [string, string, string][] = [
  ['Transfer to Emberline Software', '−' + naira(6297000), 'Bill INV-2041'],
  ['Paystack settlement', '+' + naira(322500), 'Invoice INV-00413'],
  ['Adaeze Foods Limited', '+' + naira(913750), 'Invoice INV-00412'],
]
const TITLE: Record<Scene, [string, string]> = { bills: ['Bills', 'purchases/bills'], bank: ['Banking', 'accounting/banking'], vat: ['VAT', 'tax/vat'] }

export function HeroFilm() {
  return (
    <Stage<S> width={1040} height={560} compact={{ below: 700, width: 358, height: 500 }} initial={initial} poster={POSTER} script={script} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf">
      {(s, _rect, layout) => {
        const nav = (label: string, icon: React.ReactNode, on: boolean, target?: string, sub?: string) => (
          <>
            <div className="hf-nav" data-on={on && !sub || undefined} data-target={sub ? undefined : target} data-cursor="hand">{icon}<span>{label}</span></div>
            {sub && <div className="hf-nav hf-sub" data-on={on || undefined} data-target={target} data-cursor="hand"><span>{sub}</span></div>}
          </>
        )
        return (
          <>
            <Window url={`app.taxstreem.com/${TITLE[s.scene][1]}`} className="hf-win">
              <div className="hf-app">
                <aside className="hf-side">
                  <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" className="hf-logo" />
                  <span className="hf-cap">MENU</span>
                  {nav('Home', <Home size={15} />, false)}
                  {nav('Billing', <Receipt size={15} />, false)}
                  {nav('Payments', <CreditCard size={15} />, false)}
                  {nav('Purchases', <FileText size={15} />, s.scene === 'bills', undefined, 'Bills')}
                  {nav('Accounting', <BookOpen size={15} />, s.scene === 'bank', 'nav-bank', 'Banking')}
                  {nav('Tax returns', <Percent size={15} />, s.scene === 'vat', 'nav-vat', 'VAT')}
                  {nav('Documents', <Folder size={15} />, false)}
                  <div className="hf-org"><i>ED</i><span><b>Elysium Design Studio Ltd</b><em>Owner</em></span></div>
                </aside>

                <main className="hf-main">
                  <header className="hf-top"><States value={s.scene} align="start" states={{ bills: <b>Bills</b>, bank: <b>Banking</b>, vat: <b>VAT</b> }} /></header>

                  <section className="hf-scene" data-on={s.scene === 'bills' || undefined}>
                    <div className="hf-pills"><i data-on>To approve <b>{s.approved ? 0 : 1}</b></i><i>To pay <b>2</b></i><i>Paid <b>{s.approved ? 10 : 9}</b></i></div>
                    <div className="hf-card hf-bill">
                      <div className="hf-bill-h">
                        <span className="hf-doc" aria-hidden />
                        <span className="hf-body"><b>Emberline Software Limited</b><i>INV-2041 · read from a photo · 9 Oct 2026</i></span>
                        <span className="hf-amt">{naira(6297000)}</span>
                      </div>
                      <div className="hf-bill-b">
                        <ul className="hf-checks">
                          {CHECKS.map((c, i) => <li key={c} data-on={s.checks > i || undefined}><Check on={s.checks > i} pending={s.read && s.checks === i} size={16} /><span>{c}</span></li>)}
                        </ul>
                        <div className="hf-sum">
                          <div><span>Net</span><b>{naira(5857674)}</b></div>
                          <div data-live={s.checks >= 3 || undefined}><span>Input VAT, 7.5%</span><b>{naira(INPUT)}</b></div>
                          <span className="hf-act" data-target="approve" data-cursor="hand">
                            <States value={s.approved ? 'done' : 'go'} align="end" states={{ go: <Button variant="primary" size="large">Approve and pay</Button>, done: <Badge tone="success" icon={<Check on size={13} />}>Approved and paid</Badge> }} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hf-card hf-filler" data-crop><Bar w={20} h={24} r={5} tone={2} /><span className="hf-body"><Bar w={170} h={8} tone={3} /><Bar w={120} h={6} tone={2} /></span><Bar w={86} h={9} tone={3} /></div>
                  </section>

                  <section className="hf-scene" data-on={s.scene === 'bank' || undefined}>
                    <div className="hf-bankh"><span className="hf-body"><b>GTBank ••4410</b><i>Statement to 31 Oct 2026</i></span>
                      <span className="hf-count"><Count value={s.matched} /> of 3 matched</span>
                      <States value={s.matched >= 3 ? 'ok' : 'run'} align="end" states={{ run: <Badge icon={<Spinner size={11} />}>Matching</Badge>, ok: <Badge tone="success" icon={<Check on size={12} />}>Reconciled</Badge> }} />
                    </div>
                    <div className="hf-card hf-tbl">
                      <div className="hf-tr hf-th"><span>Bank line</span><span>Amount</span><span>Matched to</span><span /></div>
                      {BANK.map(([n, amt, to], i) => (
                        <div key={n} className="hf-tr" data-on={s.matched > i || undefined}><span><b>{n}</b></span><span>{amt}</span><span className="hf-to">{to}</span><Check on={s.matched > i} pending={s.scene === 'bank' && s.matched === i} size={16} /></div>
                      ))}
                      <div className="hf-tr hf-fill" data-crop><Bar w={150} h={8} tone={3} /><Bar w={70} h={8} tone={2} /><Bar w={96} h={8} tone={2} /><Bar w={16} h={16} r={8} tone={2} /></div>
                    </div>
                  </section>

                  <section className="hf-scene" data-on={s.scene === 'vat' || undefined}>
                    <div className="hf-tiles">
                      <div className="hf-tile"><span>Output VAT</span><b>{naira(OUTPUT)}</b><em>on 14 invoices</em></div>
                      <div className="hf-tile" data-live={s.input > 0 || undefined}><span>Input VAT</span><b><Count value={s.input} format={naira} /></b><em>from supplier bills you paid</em></div>
                      <div className="hf-tile hf-pay"><span>VAT to pay</span><b><Count value={OUTPUT - s.input} format={naira} /></b><em>October 2026</em></div>
                    </div>
                    <div className="hf-card hf-tbl hf-vat">
                      <div className="hf-tr hf-th"><span>Month</span><span>Payable</span><span>Status</span><span /></div>
                      <div className="hf-tr"><span><b>Oct 2026</b></span><span><Count value={OUTPUT - s.input} format={naira} /></span>
                        <span><States value={s.filing === 'done' ? 'y' : 'n'} align="start" states={{ n: <Badge>Not filed</Badge>, y: <Badge tone="success" icon={<Check on size={12} />}>Filed with NRS</Badge> }} /></span>
                        <span className="hf-act" data-target="file" data-cursor="hand">
                          <States value={s.filing} align="end" states={{ idle: <Button variant="primary">File</Button>, busy: <Button variant="primary" icon={<Spinner size={12} />}>Filing</Button>, done: <span className="hf-rcpt">Receipt saved</span> }} />
                        </span></div>
                      <div className="hf-tr"><span><b>Sept 2026</b></span><span>{naira(584070)}</span><span><Badge tone="success">Filed</Badge></span><span /></div>
                    </div>
                    <div className="hf-card hf-ack" data-show={s.filing === 'done' || undefined}><Check on={s.filing === 'done'} size={18} /><span className="hf-body"><b>Filed with the Nigeria Revenue Service</b><i>Acknowledgement <code>VAT-2026-10-0048213</code> · payment due 21 November</i></span></div>
                  </section>
                </main>
              </div>
            </Window>
            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
