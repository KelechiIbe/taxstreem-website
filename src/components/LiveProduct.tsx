'use client'
import { useState } from 'react'
import { Home, Receipt, BookOpen, FileText, Percent, Folder, Blocks, CreditCard, Settings, Bell, ChevronDown, ChevronRight, Check, Flag, Upload, Plus, X, RotateCcw, Paperclip, HelpCircle, Wallet, CalendarDays } from 'lucide-react'
import { asset } from '../lib/asset'

// A working copy of the TaxStreem web app: same shell, same screens, sample
// data. Three jobs are waiting, as on a real dashboard: answer Atlas, review
// a supplier bill, file the VAT return.

const N = (n: number) => '₦' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
type Page = 'dashboard' | 'transactions' | 'inbox' | 'invoices' | 'vat' // home, billing invoices, books inbox, bills, VAT
const OPTIONS = [
  ['Diesel & Generator Fuel', 'Fuel bought to run the office generator', '6204', true],
  ['Motor Vehicle Running Expenses', 'Fuel and running costs for a company vehicle', '6301', false],
  ['Directors’ Current Accounts', 'Personal spending by a director, to be repaid', '2106', false],
] as const
const OUT = 1125000, INP = 439326, BILL = 6297000, FUEL = 150000

export function LiveProduct() {
  const [page, setPage] = useState<Page>('dashboard')
  const [pick, setPick] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [approved, setApproved] = useState(false)
  const [filed, setFiled] = useState<'no' | 'busy' | 'yes'>('no')
  const [tab, setTab] = useState<'cleared' | 'not' | 'settled'>('not')
  const [open, setOpen] = useState<Record<string, boolean>>({ Purchases: true, Accounting: true, 'Tax returns': true })

  const input = approved ? INP : 0
  const expenses = 9420000 + (approved ? BILL - INP : 0) + (answered ? FUEL : 0)
  const todo = [!answered, !approved, filed !== 'yes']
  const step = todo.indexOf(true)
  const reset = () => { setPage('dashboard'); setPick(null); setAnswered(false); setDrawer(false); setApproved(false); setFiled('no'); setTab('not') }
  const go = (p: Page) => { setPage(p); setDrawer(false) }
  const file = () => { setFiled('busy'); setTimeout(() => setFiled('yes'), 1500) }
  const GUIDE = [
    ['Answer the one question Atlas has', 'Open Books inbox', () => go('inbox')],
    ['Approve the supplier bill that is waiting', 'Open Bills', () => { go('invoices'); setTab('not') }],
    ['File October’s VAT return', 'Open VAT returns', () => go('vat')],
  ] as const
  const hot = step === 0 ? 'inbox' : step === 1 ? 'invoices' : step === 2 ? 'vat' : ''
  const title = { dashboard: 'Home', transactions: 'Invoices', inbox: 'Books inbox', invoices: 'Bills', vat: 'VAT' }[page]
  const martina = <img src={asset('/modules/martina-blue.svg')} alt="" width={17} height={17} />
  const Grp = ({ label, icon, badge, children }: { label: string; icon: React.ReactNode; badge?: number; children: React.ReactNode }) => (
    <>
      <button className="ap-item" onClick={() => setOpen({ ...open, [label]: !open[label] })}>{icon}<span>{label}</span>{badge ? <b>{badge}</b> : null}<ChevronDown size={14} className="ap-chev" data-open={open[label] || undefined} /></button>
      {open[label] && children}
    </>
  )
  const Off = ({ l }: { l: string }) => <span className="ap-item ap-sub ap-off">{l}</span>

  const Item = ({ p, icon, label, badge, sub }: { p: Page; icon?: React.ReactNode; label: string; badge?: number; sub?: boolean }) => (
    <button className={'ap-item' + (sub ? ' ap-sub' : '')} data-on={page === p || undefined} data-hot={hot === p && page !== p || undefined} onClick={() => go(p)}>
      {icon}<span>{label}</span>{badge ? <b>{badge}</b> : null}
    </button>
  )

  return (
    <div className="live">
      <div className="guide" data-done={step === -1 || undefined}>
        <div className="guide-steps" aria-hidden>
          {todo.map((t, i) => <i key={i} data-done={!t || undefined} data-now={i === step || undefined}>{!t ? <Check size={12} /> : i + 1}</i>)}
        </div>
        {step === -1 ? (
          <p><b>That is a month, done.</b> One answer, one approval, one return filed.</p>
        ) : (
          <p><span>Step {step + 1} of 3</span><b>{GUIDE[step][0]}</b></p>
        )}
        {step === -1 ? <button className="guide-btn" onClick={reset}><RotateCcw size={14} /> Start again</button> : <button className="guide-btn" onClick={GUIDE[step][2]}>{GUIDE[step][1]} <ChevronRight size={14} /></button>}
      </div>

      <div className="ap" data-page={page}>
        <aside className="ap-side">
          <div className="ap-brand"><img src={asset('/brand/taxstreem-logo-blue.svg')} alt="TaxStreem" /></div>
          <span className="ap-cap">MENU</span>
          <Item p="dashboard" icon={<Home size={17} />} label="Home" />
          <Grp label="Billing" icon={<Receipt size={17} />}><Item p="transactions" sub label="Invoices" /><Off l="Customers" /><Off l="Price lists" /></Grp>
          <Grp label="Payments" icon={<CreditCard size={17} />}><Off l="Wallet & payments" /></Grp>
          <Grp label="Purchases" icon={<FileText size={17} />} badge={approved ? 0 : 1}><Item p="invoices" sub label="Bills" badge={approved ? 0 : 1} /><Off l="Vendors" /></Grp>
          <Grp label="Accounting" icon={<BookOpen size={17} />} badge={answered ? 0 : 1}>
            <Item p="inbox" sub label="Books inbox" badge={answered ? 0 : 1} />
            {['Banking', 'Financial statements', 'Ledgers & reports', 'CFO pack', 'Journals', 'Fixed assets', 'Period close'].map((l) => <Off key={l} l={l} />)}
          </Grp>
          <Grp label="Tax returns" icon={<Percent size={17} />} badge={filed === 'yes' ? 0 : 1}><Item p="vat" sub label="VAT" badge={filed === 'yes' ? 0 : 1} /><Off l="Withholding tax" /><Off l="Companies income tax" /></Grp>
          <span className="ap-item ap-off"><Folder size={17} /><span>Documents</span></span>
          <span className="ap-item ap-off">{martina}<span>Martina</span></span>
          <span className="ap-cap">MORE</span>
          <span className="ap-item ap-off"><Blocks size={17} /><span>Integrations</span></span>
          <span className="ap-item ap-off"><Wallet size={17} /><span>Subscription</span></span>
          <span className="ap-item ap-off"><Settings size={17} /><span>Settings</span></span>
          <div className="ap-org"><i>ED</i><span><b>Elysium Design Studio Ltd</b><em>Owner</em></span></div>
        </aside>

        <div className="ap-main">
          <header className="ap-top">
            <h3>{title}</h3>
            <span className="ap-help"><HelpCircle size={14} /> Help</span>
            <span className="ap-bell"><Bell size={16} /><b>{todo.filter(Boolean).length || ''}</b></span>
          </header>
          <nav className="ap-mnav" aria-label="App pages">
            {([['dashboard', 'Home'], ['inbox', 'Books inbox'], ['invoices', 'Bills'], ['vat', 'VAT'], ['transactions', 'Invoices']] as const).map(([p, l]) => (
              <button key={p} data-on={page === p || undefined} data-hot={hot === p && page !== p || undefined} onClick={() => go(p)}>{l}</button>
            ))}
          </nav>

          <div className="ap-body" key={page}>
            {page === 'dashboard' && <>
              <div className="ap-greet">
                <div><b>Good afternoon, Ada</b><i>Elysium Design Studio Ltd · books closed to 30 Sept 2026</i></div>
                <span className="ap-acts"><button className="ap-primary" onClick={() => go('transactions')}><FileText size={14} /> New invoice</button><button className="ap-btn" onClick={() => go('invoices')}><Paperclip size={14} /> Bill</button><span className="ap-btn"><Upload size={14} /> Bank statement</span></span>
              </div>
              <div className="ap-yn"><b>Your numbers</b><span className="ap-btn"><CalendarDays size={14} /> Figures for <b>October 2026</b> <ChevronDown size={13} /></span></div>
              <div className="ap-kpis">
                {[['Sales', 15000000, '14 invoices'], ['Costs', expenses, answered && approved ? 'all posted' : 'still moving'], ['Profit', 15000000 - expenses, ''], ['Customers owe you', 2335500, '3 invoices, 1 overdue'], ['You owe vendors', approved ? 850550 : 850550 + BILL, approved ? '2 bills' : '3 bills'], ['VAT to pay', OUT - input, 'October, due 21 Nov']].map(([l, v, sub]) => (
                  <div key={l as string} className="ap-kpi"><span>{l}</span><b key={v as number} className="flash">{N(v as number)}</b>{sub && <em>{sub}</em>}</div>
                ))}
              </div>
              <div className="ap-two">
                <div className="ap-card ap-needs">
                  <h4>Needs you <em>{todo.filter(Boolean).length ? `${todo.filter(Boolean).length} thing${todo.filter(Boolean).length === 1 ? '' : 's'}` : 'All clear'}</em></h4>
                  {!answered && <button onClick={() => go('inbox')}><i className="ic blue"><BookOpen size={15} /></i><span><b>1 question from Atlas</b><i>A bank line it was not sure about. Each answer can teach it a rule.</i></span><u>Answer</u></button>}
                  {!approved && <button onClick={() => { go('invoices'); setTab('not') }}><i className="ic amber"><FileText size={15} /></i><span><b>1 bill to approve</b><i>Emberline Software, above your approval limit.</i></span><u>Review</u></button>}
                  {filed !== 'yes' && <button onClick={() => go('vat')}><i className="ic green"><Percent size={15} /></i><span><b>October VAT return</b><i>Prepared from your books. Due 21 November.</i></span><u>File</u></button>}
                  {step === -1 && <p className="ap-clear"><Check size={16} /> Nothing waiting. Atlas keeps the books and asks here when it needs you.</p>}
                </div>
                <Tx short />
              </div>
            </>}

            {page === 'transactions' && <><div className="ap-pills"><i data-on>All <b>14</b></i><i>Unpaid <b>3</b></i><i>Overdue <b>1</b></i><i>Paid <b>11</b></i></div><Tx /></>}

            {page === 'inbox' && <>
              <div className="ap-h"><div><p>What Atlas could not post on its own waits here as one plain question, with its best guess.</p></div><span className="ap-btn">Run the bookkeeper</span></div>
              <div className="ap-pills"><i data-on>Questions <b>{answered ? 0 : 1}</b></i><i>Posted by Atlas</i></div>
              {answered ? (
                <div className="ap-card ap-empty"><Check size={22} /><b>Inbox clear</b><p>Posted to {OPTIONS[pick ?? 0][2]} {OPTIONS[pick ?? 0][0]}. Atlas will do the same next time for Total Energies.</p></div>
              ) : (
                <div className="ap-card ap-q">
                  <div className="ap-qh"><b>What was the {N(FUEL)} paid to Total Energies for?</b><em>−{N(FUEL)}</em></div>
                  <p className="ap-meta">14 Oct 2026 · GTBank ••4410 · &ldquo;POS PURCHASE TOTAL ENERGIES LEKKI PH1&rdquo;</p>
                  <p className="ap-guess">Atlas&rsquo;s best guess is Diesel &amp; Generator Fuel: the payee is a filling station and the amount matches earlier generator top-ups.</p>
                  {OPTIONS.map(([t, d, c, best], i) => (
                    <button key={c} className="ap-opt" aria-pressed={pick === i} onClick={() => setPick(i)}>
                      <span className="ap-radio" /><span><b>{t}{best && <em>Atlas&rsquo;s best guess · 71% sure</em>}</b><i>{d}</i></span><code>{c}</code>
                    </button>
                  ))}
                  <div className="ap-qf"><label><input type="checkbox" defaultChecked /> Do the same next time for this payee</label><button className="ap-primary" disabled={pick === null} onClick={() => setAnswered(true)}>Post to the books</button></div>
                </div>
              )}
            </>}

            {page === 'invoices' && <>
              <div className="ap-tools"><div className="ap-pills"><i data-on>Bills</i><i>Supplier invoices</i><i>Credit notes</i></div><span className="ap-btn ap-right"><Upload size={14} /> Upload invoices</span><span className="ap-primary"><Plus size={14} /> New bill</span></div>
              <div className="ap-pills">
                <i data-on={tab === 'not' || undefined} onClick={() => setTab('not')}>To approve <b>{approved ? 0 : 1}</b></i>
                <i data-on={tab === 'cleared' || undefined} onClick={() => setTab('cleared')}>To pay <b>2</b></i>
                <i data-on={tab === 'settled' || undefined} onClick={() => setTab('settled')}>Paid <b>{approved ? 10 : 9}</b></i>
              </div>
              <div className="ap-card ap-table">
                <div className="ap-tr ap-th"><span>Vendor</span><span>Total</span><span className="hide-s">Bill</span><span>Status</span><span className="hide-s">Date</span><span /></div>
                {tab === 'not' && !approved && <button className="ap-tr ap-row" data-hot onClick={() => setDrawer(true)}><span><b>Emberline Software Limited</b></span><span>{N(BILL)}</span><span className="hide-s">INV-2041</span><span><em className="tag amber">To approve</em></span><span className="hide-s">9 Oct 2026</span><ChevronRight size={16} /></button>}
                {tab === 'not' && approved && <p className="ap-none">Nothing is waiting for approval.</p>}
                {tab === 'cleared' && <>
                  <div className="ap-tr"><span><b>Kestrel Advisory Partners Limited</b></span><span>{N(666250)}</span><span className="hide-s">INV-0388</span><span><em className="tag blue">To pay</em></span><span className="hide-s">21 Oct 2026</span><span /></div>
                  <div className="ap-tr"><span><b>Ikeja Electric Plc</b></span><span>{N(184300)}</span><span className="hide-s">IE-771204</span><span><em className="tag blue">To pay</em></span><span className="hide-s">27 Oct 2026</span><span /></div>
                </>}
                {tab === 'settled' && <>
                  {approved && <div className="ap-tr new"><span><b>Emberline Software Limited</b></span><span>{N(BILL)}</span><span className="hide-s">INV-2041</span><span><em className="tag ok"><Check size={12} /> Paid</em></span><span className="hide-s">9 Oct 2026</span><span /></div>}
                  <div className="ap-tr"><span><b>MainOne Cable Company</b></span><span>{N(215000)}</span><span className="hide-s">MO-33190</span><span><em className="tag ok"><Check size={12} /> Paid</em></span><span className="hide-s">5 Oct 2026</span><span /></div>
                  <div className="ap-tr"><span><b>Lekki Workspace Limited</b></span><span>{N(1290000)}</span><span className="hide-s">LW-0912</span><span><em className="tag ok"><Check size={12} /> Paid</em></span><span className="hide-s">1 Oct 2026</span><span /></div>
                </>}
              </div>
            </>}

            {page === 'vat' && <>
              <div className="ap-pills"><i data-on>By month</i><i>Sales from another POS</i><i>Input VAT invoices</i><i>Customs entries</i></div>
              <div className="ap-tiles ap-4">
                <div className="ap-tile"><span>Input VAT credit carried forward</span><b>{N(0)}</b><em>Used in later months, oldest first</em></div>
                <div className="ap-tile"><span>Refund can be claimed on</span><b>{N(0)}</b><em>Credit from the last 12 months</em></div>
                <div className="ap-tile"><span>Withholding VAT to pay over</span><b>{N(0)}</b><em>See Withholding tax</em></div>
                <div className="ap-tile"><span>Months not filed</span><b key={filed} className="flash">{filed === 'yes' ? 0 : 1}</b><em>Due the 21st of the next month</em></div>
              </div>
              <div className="ap-card ap-table ap-vat">
                <div className="ap-cardh"><b>VAT by month</b><i>Open a month to see how its VAT is worked out.</i></div>
                <div className="ap-tr ap-th"><span>Month</span><span className="hide-s">Output VAT</span><span>Input VAT</span><span className="hide-s">Credit used</span><span>Payable</span><span>Status</span><span /></div>
                <div className="ap-tr"><span><b>Nov 2026</b><small>running</small></span><span className="hide-s">{N(318750)}</span><span>{N(0)}</span><span className="hide-s">—</span><span><b>{N(318750)}</b></span><span><em className="tag">Not filed</em></span><span /></div>
                <div className="ap-tr" data-live={step === 2 || undefined}><span><b>Oct 2026</b></span><span className="hide-s">{N(OUT)}</span><span key={input} className="flash">{N(input)}</span><span className="hide-s">—</span><span><b key={input} className="flash">{N(OUT - input)}</b></span>
                  <span>{filed === 'yes' ? <em className="tag ok"><Check size={12} /> Filed</em> : <em className="tag">Not filed</em>}</span>
                  <span>{filed !== 'yes' && <button className="ap-primary" data-hot={filed === 'no' || undefined} disabled={filed === 'busy'} onClick={file}>{filed === 'busy' ? 'Filing…' : 'File'}</button>}</span></div>
                <div className="ap-tr"><span><b>Sept 2026</b></span><span className="hide-s">{N(986250)}</span><span>{N(402180)}</span><span className="hide-s">—</span><span><b>{N(584070)}</b></span><span><em className="tag ok"><Check size={12} /> Filed</em></span><span /></div>
              </div>
              {filed === 'yes' && <div className="ap-card ap-receipt"><Check size={18} /><span><b>Filed with the Nigeria Revenue Service</b><i>Acknowledgement VAT-2026-10-0048213 · saved in Documents · payment due 21 November</i></span></div>}
              {filed === 'no' && !approved && <p className="ap-tip">Input VAT is {N(0)} because the Emberline bill is still waiting under Invoices. Approve it and this return changes.</p>}
            </>}
          </div>

          <div className="ap-drawer" data-show={drawer || undefined} aria-hidden={!drawer}>
            <div className="ap-dh"><b>Emberline Software Limited</b><button aria-label="Close" onClick={() => setDrawer(false)}><X size={18} /></button></div>
            <div className="ap-paper"><span>INVOICE INV-2041</span><b>{N(BILL)}</b><i>Annual design software licences, 24 seats</i></div>
            <ul className="ap-checks">
              <li><Check size={14} /> The sums on the invoice add up</li>
              <li><Check size={14} /> This invoice number has not been paid before</li>
              <li><Check size={14} /> The supplier&rsquo;s Tax ID is valid with the NRS</li>
              <li><Flag size={14} /> Above your {N(5000000)} approval limit, so it waited for you</li>
            </ul>
            <dl><div><dt>Net</dt><dd>{N(BILL - INP)}</dd></div><div><dt>VAT at 7.5%</dt><dd>{N(INP)}</dd></div><div><dt>Total</dt><dd><b>{N(BILL)}</b></dd></div></dl>
            <button className="ap-primary ap-wide" data-hot onClick={() => { setApproved(true); setDrawer(false); setTab('settled') }}>Approve and pay</button>
          </div>
          <span className="ap-fab" aria-hidden><img src={asset('/modules/martina-blue.svg')} alt="" width={22} height={22} /></span>
        </div>
        <i className="beam" aria-hidden />
      </div>
      <p className="live-caption">This is TaxStreem for a service business, with sample data. <span>Nothing you click here is sent anywhere.</span></p>
    </div>
  )
}

function Tx({ short }: { short?: boolean }) {
  const rows: [string, string, string, string, 'paid' | 'due' | 'late'][] = [
    ['INV-00412', 'Adaeze Foods Limited', '6 Oct', N(913750), 'paid'],
    ['INV-00413', 'Lekki Print Hub', '12 Oct', N(322500), 'due'],
    ['INV-00414', 'Bola & Sons Enterprises', '19 Oct', N(415500), 'late'],
    ['INV-00415', 'Northgate Schools', '24 Oct', N(1597500), 'due'],
    ['INV-00416', 'Harbour Clinic', '29 Oct', N(2687500), 'paid'],
  ]
  const chip = { paid: <em className="tag ok"><Check size={12} /> Paid</em>, due: <em className="tag blue">Sent</em>, late: <em className="tag red">Overdue 9 days</em> }
  return (
    <div className="ap-card ap-table ap-tx">
      <div className="ap-cardh"><b>{short ? 'Latest invoices' : 'Invoices'}</b>{short ? <i>All</i> : <span className="ap-primary"><Plus size={14} /> New invoice</span>}</div>
      {rows.slice(0, short ? 4 : 5).map(([n, c, d, a, st]) => (
        <div key={n} className="ap-tr"><span><b>{n}</b> <i className="ap-cust">{c}</i><small>{d} 2026{st === 'paid' ? ' · e-invoice validated by NRS' : ''}</small></span><span className="ap-tr-end">{chip[st]}<b>{a}</b></span></div>
      ))}
    </div>
  )
}
