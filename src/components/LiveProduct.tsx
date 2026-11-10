'use client'
import { useState } from 'react'
import { Home, ArrowLeftRight, BookOpen, Landmark, FileText, Users, Percent, Folder, Sparkles, Plug, CreditCard, Settings, Bell, MessageSquare, ChevronDown, ChevronRight, Check, Flag, Download, SlidersHorizontal, Upload, Plus, X, ArrowDown, ArrowUp, RotateCcw } from 'lucide-react'
import { asset } from '../lib/asset'

// A working copy of the TaxStreem web app: same shell, same screens, sample
// data. Three jobs are waiting, as on a real dashboard: answer Atlas, review
// a supplier bill, file the VAT return.

const N = (n: number) => '₦' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
type Page = 'dashboard' | 'transactions' | 'inbox' | 'invoices' | 'vat'
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
  const [acct, setAcct] = useState(true)
  const [taxOpen, setTaxOpen] = useState(true)

  const input = approved ? INP : 0
  const expenses = 9420000 + (approved ? BILL - INP : 0) + (answered ? FUEL : 0)
  const todo = [!answered, !approved, filed !== 'yes']
  const step = todo.indexOf(true)
  const reset = () => { setPage('dashboard'); setPick(null); setAnswered(false); setDrawer(false); setApproved(false); setFiled('no'); setTab('not') }
  const go = (p: Page) => { setPage(p); setDrawer(false) }
  const file = () => { setFiled('busy'); setTimeout(() => setFiled('yes'), 1500) }
  const GUIDE = [
    ['Answer the one question Atlas has', 'Open Books inbox', () => go('inbox')],
    ['Review the supplier bill that was held back', 'Open Invoices', () => { go('invoices'); setTab('not') }],
    ['File October’s VAT return', 'Open VAT returns', () => go('vat')],
  ] as const
  const hot = step === 0 ? 'inbox' : step === 1 ? 'invoices' : step === 2 ? 'vat' : ''
  const title = { dashboard: 'Dashboard', transactions: 'Transactions', inbox: 'Accounting', invoices: 'Invoices', vat: 'VAT returns' }[page]

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
          <span className="ap-cap">Menu</span>
          <Item p="dashboard" icon={<Home size={16} />} label="Dashboard" />
          <Item p="transactions" icon={<ArrowLeftRight size={16} />} label="Transactions" />
          <button className="ap-item" onClick={() => setAcct(!acct)}><BookOpen size={16} /><span>Accounting</span>{!answered && <b>1</b>}<ChevronDown size={14} className="ap-chev" data-open={acct || undefined} /></button>
          {acct && <>
            <Item p="inbox" sub label="Books inbox" badge={answered ? 0 : 1} />
            {['Journals', 'General ledger', 'Chart of accounts', 'Trial balance', 'Financial statements', 'CFO pack'].map((l) => <span key={l} className="ap-item ap-sub ap-off">{l}</span>)}
          </>}
          <span className="ap-item ap-off"><Landmark size={16} /><span>Finance</span><ChevronRight size={14} className="ap-chev" /></span>
          <Item p="invoices" icon={<FileText size={16} />} label="Invoices" badge={approved ? 0 : 1} />
          <span className="ap-item ap-off"><Users size={16} /><span>Contacts</span><ChevronRight size={14} className="ap-chev" /></span>
          <button className="ap-item" onClick={() => setTaxOpen(!taxOpen)}><Percent size={16} /><span>Tax returns</span><ChevronDown size={14} className="ap-chev" data-open={taxOpen || undefined} /></button>
          {taxOpen && <>
            <span className="ap-item ap-sub ap-off">Unfiled taxes</span>
            <Item p="vat" sub label="VAT" />
            <span className="ap-item ap-sub ap-off">Withholding tax</span>
            <span className="ap-item ap-sub ap-off">Companies income tax</span>
          </>}
          <span className="ap-item ap-off"><Folder size={16} /><span>Documents</span></span>
          <span className="ap-item ap-off"><Sparkles size={16} /><span>Martina</span></span>
          <span className="ap-cap">More</span>
          <span className="ap-item ap-off"><Plug size={16} /><span>Integrations</span></span>
          <span className="ap-item ap-off"><CreditCard size={16} /><span>Subscriptions</span></span>
          <span className="ap-item ap-off"><Settings size={16} /><span>Settings</span></span>
          <div className="ap-org"><i>ED</i><span><b>ELYSIUM DESIGN STUDIO LIMITED</b><em>finance@elysium.example</em></span></div>
        </aside>

        <div className="ap-main">
          <header className="ap-top">
            <h3>{title}</h3>
            <span className="ap-help"><MessageSquare size={14} /> Get Help</span>
            <span className="ap-bell"><Bell size={16} /><b>{todo.filter(Boolean).length || ''}</b></span>
          </header>
          <nav className="ap-mnav" aria-label="App pages">
            {([['dashboard', 'Dashboard'], ['inbox', 'Books inbox'], ['invoices', 'Invoices'], ['vat', 'VAT returns'], ['transactions', 'Transactions']] as const).map(([p, l]) => (
              <button key={p} data-on={page === p || undefined} data-hot={hot === p && page !== p || undefined} onClick={() => go(p)}>{l}</button>
            ))}
          </nav>

          <div className="ap-body" key={page}>
            {page === 'dashboard' && <>
              <div className="ap-tools">
                <span className="ap-range"><em>FROM</em> <b>1 Oct</b> <em>TO</em> <b>31 Oct</b><i>7D</i><i data-on>30D</i><i>90D</i><i>1Y</i></span>
                <span className="ap-btn"><SlidersHorizontal size={14} /> Customize view</span>
                <span className="ap-btn ap-right"><Download size={14} /> Export report</span>
              </div>
              <div className="ap-tiles ap-5">
                {[['Total Revenue', 15000000], ['Total Expenses', expenses], ['Total withholding Tax', 212500], ['Total VAT payable', OUT - input], ['Total Refunds', 0]].map(([l, v]) => (
                  <div key={l as string} className="ap-tile"><span>{l}</span><b key={v as number} className="flash">{N(v as number)}</b></div>
                ))}
              </div>
              <div className="ap-two">
                <div className="ap-card">
                  <h4>Cash flow graph</h4>
                  <div className="ap-legend"><i style={{ background: '#16a34a' }} />Total Revenue<i style={{ background: '#dc2626' }} />Total Expenses<i style={{ background: '#0072f5' }} />Total VAT payable</div>
                  <svg viewBox="0 0 600 190" className="ap-chart" aria-label="Cash flow chart" preserveAspectRatio="none">
                    {[30, 70, 110, 150].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#eef1f5" />)}
                    <path className="draw" d="M0 150 C60 140 90 96 150 104 S250 60 310 72 S420 30 480 44 S560 18 600 22" fill="none" stroke="#16a34a" strokeWidth="2.5" />
                    <path className="draw d2" d="M0 165 C70 160 110 132 170 138 S270 112 330 118 S440 90 500 98 S570 80 600 84" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                    <path className="draw d3" d="M0 178 C80 176 120 170 180 171 S300 162 360 164 S470 154 600 150" fill="none" stroke="#0072f5" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="ap-card ap-needs">
                  <h4>Needs you <em>{todo.filter(Boolean).length ? `${todo.filter(Boolean).length} things` : 'All clear'}</em></h4>
                  {!answered && <button onClick={() => go('inbox')}><span><b>1 question from Atlas</b><i>A bank line it was not sure about. Each answer can teach it a rule.</i></span><u>Answer</u></button>}
                  {!approved && <button onClick={() => { go('invoices'); setTab('not') }}><span><b>1 bill to review</b><i>A supplier invoice held back until you approve it.</i></span><u>Review</u></button>}
                  {filed !== 'yes' && <button onClick={() => go('vat')}><span><b>October VAT return</b><i>Due 21 November. Prepared from your books.</i></span><u>File</u></button>}
                  {step === -1 && <p className="ap-clear"><Check size={16} /> Nothing is waiting on you.</p>}
                </div>
              </div>
              <Tx answered={answered} approved={approved} short />
            </>}

            {page === 'transactions' && <Tx answered={answered} approved={approved} />}

            {page === 'inbox' && <>
              <div className="ap-h"><div><h4 className="ap-big">Books inbox</h4><p>What Atlas could not post on its own waits here as one plain question, with its best guess.</p></div><span className="ap-btn"><Sparkles size={14} /> Run the bookkeeper</span></div>
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
              <div className="ap-tools"><span className="ap-btn">All time <ChevronDown size={14} /></span><span className="ap-link">Vendor invoice upload link <u>app.taxstreem.com/vendor-up…</u></span><span className="ap-btn ap-right"><Upload size={14} /> Upload invoices</span><span className="ap-primary"><Plus size={14} /> Create Invoice</span></div>
              <div className="ap-pills">
                <i data-on={tab === 'settled' || undefined} onClick={() => setTab('settled')}>Settled <b>{approved ? 13 : 12}</b></i>
                <i data-on={tab === 'cleared' || undefined} onClick={() => setTab('cleared')}>Cleared for payment <b>2</b></i>
                <i data-on={tab === 'not' || undefined} onClick={() => setTab('not')}>Not yet cleared <b>{approved ? 0 : 1}</b></i>
                <i>Incoming payments <b>3</b></i><i>Drafts <b>0</b></i>
              </div>
              <div className="ap-card ap-table">
                <div className="ap-tr ap-th"><span>Name</span><span>Amount</span><span className="hide-s">Source</span><span>Type</span><span className="hide-s">Date issued</span><span /></div>
                {tab === 'not' && !approved && <button className="ap-tr ap-row" data-hot onClick={() => setDrawer(true)}><span><b>Emberline Software Limited</b></span><span>{N(BILL)}</span><span className="hide-s">UPLOAD</span><span><em className="exp"><ArrowUp size={12} /> Expense</em></span><span className="hide-s">Oct 9th, 2026</span><ChevronRight size={16} /></button>}
                {tab === 'not' && approved && <p className="ap-none">Nothing is waiting to be cleared.</p>}
                {tab === 'cleared' && <>
                  <div className="ap-tr"><span><b>Kestrel Advisory Partners Limited</b></span><span>{N(666250)}</span><span className="hide-s">EMAIL</span><span><em className="exp"><ArrowUp size={12} /> Expense</em></span><span className="hide-s">Oct 21st, 2026</span><span /></div>
                  <div className="ap-tr"><span><b>Ikeja Electric Plc</b></span><span>{N(184300)}</span><span className="hide-s">UPLOAD</span><span><em className="exp"><ArrowUp size={12} /> Expense</em></span><span className="hide-s">Oct 27th, 2026</span><span /></div>
                </>}
                {tab === 'settled' && <>
                  {approved && <div className="ap-tr new"><span><b>Emberline Software Limited</b></span><span>{N(BILL)}</span><span className="hide-s">UPLOAD</span><span><em className="exp"><ArrowUp size={12} /> Expense</em></span><span className="hide-s">Oct 9th, 2026</span><span /></div>}
                  <div className="ap-tr"><span><b>Adaeze Foods Limited</b></span><span>{N(913750)}</span><span className="hide-s">INVOICE</span><span><em className="inc"><ArrowDown size={12} /> Income</em></span><span className="hide-s">Oct 6th, 2026</span><span /></div>
                  <div className="ap-tr"><span><b>Lekki Print Hub</b></span><span>{N(322500)}</span><span className="hide-s">INVOICE</span><span><em className="inc"><ArrowDown size={12} /> Income</em></span><span className="hide-s">Oct 3rd, 2026</span><span /></div>
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
                <div className="ap-tr ap-th"><span>Month</span><span>Output VAT</span><span>Input VAT</span><span className="hide-s">Credit used</span><span>Payable</span><span>Status</span><span /></div>
                <div className="ap-tr"><span><b>Nov 2026</b><small>running</small></span><span>{N(318750)}</span><span>{N(0)}</span><span className="hide-s">—</span><span><b>{N(318750)}</b></span><span><em className="tag">Not filed</em></span><span /></div>
                <div className="ap-tr" data-live={step === 2 || undefined}><span><b>Oct 2026</b></span><span>{N(OUT)}</span><span key={input} className="flash">{N(input)}</span><span className="hide-s">—</span><span><b key={input} className="flash">{N(OUT - input)}</b></span>
                  <span>{filed === 'yes' ? <em className="tag ok"><Check size={12} /> Filed</em> : <em className="tag">Not filed</em>}</span>
                  <span>{filed !== 'yes' && <button className="ap-primary" data-hot={filed === 'no' || undefined} disabled={filed === 'busy'} onClick={file}>{filed === 'busy' ? 'Filing…' : 'File'}</button>}</span></div>
                <div className="ap-tr"><span><b>Sept 2026</b></span><span>{N(986250)}</span><span>{N(402180)}</span><span className="hide-s">—</span><span><b>{N(584070)}</b></span><span><em className="tag ok"><Check size={12} /> Filed</em></span><span /></div>
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
          <span className="ap-fab" aria-hidden><Sparkles size={20} /></span>
        </div>
      </div>
      <p className="live-caption">This is the TaxStreem web app with sample data. <span>Nothing you click here is sent anywhere.</span></p>
    </div>
  )
}

function Tx({ answered, approved, short }: { answered: boolean; approved: boolean; short?: boolean }) {
  const rows: [string, string, string, 'in' | 'out', number, string[]][] = [
    ['TOTAL ENERGIES LEKKI', 'GTBank', N(FUEL), 'out', answered ? 100 : 35, []],
    ['ADAEZE FOODS LIMITED', 'Invoice', N(913750), 'in', 100, ['VAT']],
    ['LEKKI PRINT HUB', 'Paystack', N(322500), 'in', 96, ['VAT', 'WHT']],
    ['EMBERLINE SOFTWARE LIMITED', approved ? 'GTBank' : 'Upload', N(BILL), 'out', approved ? 100 : 62, approved ? ['VAT'] : []],
    ['BOLA & SONS ENTERPRISES', 'Moniepoint', N(415500), 'in', 88, ['VAT']],
  ]
  return (
    <div className="ap-card ap-table ap-tx">
      <div className="ap-cardh"><b>Transactions</b>{!short && <span className="ap-btn"><Flag size={14} /> Flag threshold</span>}</div>
      <div className="ap-tr ap-th"><span>Name</span><span className="hide-s">Source</span><span>Amount</span><span>Type</span><span>Confidence score</span><span className="hide-s">Tax</span></div>
      {rows.slice(0, short ? 4 : 5).map(([n, s, a, t, c, tax]) => (
        <div key={n} className="ap-tr" data-flag={c < 50 || undefined}><span><b>{n}</b></span><span className="hide-s">{s}</span><span>{a}</span>
          <span><em className={t === 'in' ? 'inc' : 'exp'}>{t === 'in' ? <ArrowDown size={12} /> : <ArrowUp size={12} />} {t === 'in' ? 'Income' : 'Expense'}</em></span>
          <span><em key={c} className={'conf flash ' + (c < 50 ? 'lo' : 'hi')}>{c}% {c < 50 ? <Flag size={11} /> : <Check size={11} />}</em></span>
          <span className="hide-s">{tax.map((x) => <em key={x} className="tag blue">{x}</em>)}</span></div>
      ))}
    </div>
  )
}
