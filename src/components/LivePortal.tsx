'use client'
import { useState } from 'react'
import { Building2, CalendarDays, Users, Award, CreditCard, Settings, Plus, Check, Download, Upload, Copy, ChevronRight, ChevronLeft, RotateCcw, Send, MessageCircle, ShieldCheck } from 'lucide-react'
import { asset } from '../lib/asset'

// A working copy of the accountant portal: every page, sample data. Three jobs are waiting, as in a real practice:
// take on a business that asked for you, book a return you changed, and see what the practice has earned.

const N = (n: number) => '₦' + n.toLocaleString('en-US')
type Page = 'clients' | 'client' | 'deadlines' | 'team' | 'earnings' | 'billing' | 'practice'
type Tone = 'red' | 'amber' | 'green' | 'blue' | 'grey'
type Client = { name: string; services: string; chips: [string, Tone][]; next: string; touched: string }
const BASE: Client[] = [
  { name: 'Adaeze Foods Limited', services: 'Accounting, VAT, WHT, Companies income tax', chips: [['VAT due 21 Nov', 'amber'], ['1 changed file', 'blue']], next: 'VAT 21 Nov', touched: 'today' },
  { name: 'Lekki Print Hub', services: 'Accounting, VAT', chips: [['WHT deadline passed', 'red'], ['1 answer', 'blue']], next: 'VAT 21 Nov', touched: 'yesterday' },
  { name: 'Emberline Software Limited', services: 'VAT, WHT, Companies income tax', chips: [['2 due in 14 days', 'amber']], next: 'WHT 21 Nov', touched: '2 days ago' },
  { name: 'Northgate Schools', services: 'Accounting, Financial statements', chips: [], next: 'CIT 30 Jun', touched: '3 days ago' },
  { name: 'Kano Agro Mills', services: 'Accounting, VAT, Payroll', chips: [['1 answer', 'blue']], next: 'VAT 21 Nov', touched: 'last week' },
]
const HARBOUR: Client = { name: 'Harbour Clinic', services: 'Accounting, VAT', chips: [['New client', 'green']], next: 'VAT 21 Nov', touched: 'not yet' }
const DUE: [number, string, string, number | null, string, boolean, 'vat' | 'wht' | 'cit'][] = [
  [1, 'WHT remittance', 'Sept 2026', 64000, '21 Oct', true, 'wht'], [0, 'VAT return', 'Oct 2026', 712500, '21 Nov', false, 'vat'], [0, 'WHT remittance', 'Oct 2026', 86000, '21 Nov', false, 'wht'],
  [2, 'VAT return', 'Oct 2026', 318200, '21 Nov', false, 'vat'], [2, 'WHT remittance', 'Oct 2026', 41500, '21 Nov', false, 'wht'], [4, 'VAT return', 'Oct 2026', 156750, '21 Nov', false, 'vat'], [3, 'CIT return', '2026', null, '30 Jun', false, 'cit'],
]
const FILES: [string, string][] = [['VAT return', 'October 2026'], ['WHT schedule', 'October 2026'], ['CIT return', '2026'], ['Financial statements', 'Year to 31 Oct 2026']]
const TEAM: [string, string, string, Tone][] = [['Tunde Bello', 'Partner', 'ICAN verified', 'green'], ['Ngozi Eze', 'Manager', 'CITN verified', 'green'], ['Sola Akin', 'Staff', 'Waiting for TaxStreem', 'amber']]
const NAVS: [Page, string, React.ReactNode][] = [['clients', 'Clients', <Building2 key="i" size={17} />], ['deadlines', 'Deadlines', <CalendarDays key="i" size={17} />], ['team', 'Team', <Users key="i" size={17} />], ['earnings', 'Earnings', <Award key="i" size={17} />], ['billing', 'Billing', <CreditCard key="i" size={17} />], ['practice', 'Practice', <Settings key="i" size={17} />]]
const TITLE: Record<Page, string> = { clients: 'Clients', client: 'Client', deadlines: 'Deadlines', team: 'Team', earnings: 'Earnings', billing: 'Billing', practice: 'Practice' }

export function LivePortal() {
  const [page, setPage] = useState<Page>('clients'); const [cid, setCid] = useState(0)
  const [took, setTook] = useState(false); const [inviting, setInviting] = useState(false); const [invited, setInvited] = useState<string[]>([]); const [q, setQ] = useState('')
  const [file, setFile] = useState<'none' | 'review' | 'booked'>('review'); const [accept, setAccept] = useState(false)
  const [kind, setKind] = useState('A document'); const [ask, setAsk] = useState(''); const [reqs, setReqs] = useState<[string, string][]>([['A document', 'September bank statement, GTBank']])
  const [seg, setSeg] = useState('all'); const [people, setPeople] = useState<string[]>([]); const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState(false); const [seen, setSeen] = useState(false); const [pays, setPays] = useState<Record<string, boolean>>({ 'Lekki Print Hub': true }); const [body, setBody] = useState('ICAN')

  const clients = took ? [...BASE, HARBOUR] : BASE
  const c = clients[cid] ?? clients[0]
  const todo = [!took, file !== 'booked', !seen]; const step = todo.indexOf(true)
  const go = (p: Page) => { setPage(p); if (p === 'earnings') setSeen(true) }
  const open = (i: number) => { setCid(i); setPage('client') }
  const reset = () => { setPage('clients'); setCid(0); setTook(false); setInviting(false); setInvited([]); setQ(''); setFile('review'); setAccept(false); setReqs([['A document', 'September bank statement, GTBank']]); setSeg('all'); setPeople([]); setCopied(false); setSeen(false) }
  const GUIDE = [['Take on the business asking for you', 'Open Clients', () => go('clients')], ['Book the VAT return you changed for Adaeze Foods', 'Open the client', () => open(0)], ['See what the practice has earned', 'Open Earnings', () => go('earnings')]] as const
  const Chip = ({ t, tone }: { t: string; tone: Tone }) => <em className="pt-chip" data-tone={tone}>{t}</em>
  const paying = 7 + (took ? 1 : 0)

  return (
    <div className="lp">
      <div className="guide" data-done={step === -1 || undefined}>
        <div className="guide-steps" aria-hidden>{todo.map((t, i) => <i key={i} data-done={!t || undefined} data-now={i === step || undefined}>{!t ? <Check size={12} /> : i + 1}</i>)}</div>
        {step === -1 ? <p><b>That is a practice, run from one screen.</b> A client taken on, a return booked, earnings checked.</p> : <p><span>Step {step + 1} of 3</span><b>{GUIDE[step][0]}</b></p>}
        {step === -1 ? <button className="guide-btn" onClick={reset}><RotateCcw size={14} /> Start again</button> : <button className="guide-btn" onClick={GUIDE[step][2]}>{GUIDE[step][1]} <ChevronRight size={14} /></button>}
      </div>

      <div className="ap pt" data-page={page}>
        <aside className="ap-side">
          <div className="ap-brand"><img src={asset('/brand/taxstreem-logo-blue.svg')} alt="TaxStreem" /></div>
          <span className="pt-badge">Accountant portal</span>
          {NAVS.map(([p, l, icon]) => <button key={p} className="ap-item" data-on={page === p || (p === 'clients' && page === 'client') || undefined} onClick={() => go(p)}>{icon}<span>{l}</span>{p === 'clients' && !took && <b>1</b>}</button>)}
          <div className="ap-org"><i>BE</i><span><b>Bello & Eze Chartered Accountants</b><em>Partner</em></span></div>
        </aside>

        <div className="ap-main">
          <header className="ap-top"><h3>{page === 'client' ? c.name : TITLE[page]}</h3><span className="ap-help hide-s">tunde@belloeze.ng</span></header>
          <nav className="ap-mnav" aria-label="Portal pages">{NAVS.map(([p, l]) => <button key={p} data-on={page === p || (p === 'clients' && page === 'client') || undefined} onClick={() => go(p)}>{l}</button>)}</nav>

          <div className="ap-body" key={page + cid}>
            {page === 'clients' && <>
              <div className="ap-h"><p>Bello & Eze Chartered Accountants: {clients.length} businesses you look after.</p><button className="ap-primary" onClick={() => setInviting(true)}><Plus size={14} /> Invite a business</button></div>
              {inviting && <form className="ap-card pt-form" onSubmit={(e) => { e.preventDefault(); const v = String(new FormData(e.currentTarget).get('email') || '').trim(); if (v) { setInvited([...invited, v]); setInviting(false) } }}>
                <b>Invite a business by its owner's email</b><div><input name="email" type="email" placeholder="owner@business.com" aria-label="Owner's email" /><button className="ap-primary">Send invitation</button><button type="button" className="ap-btn" onClick={() => setInviting(false)}>Cancel</button></div>
              </form>}
              {!took && <div className="ap-card pt-ask"><span><b>Harbour Clinic asks you to be their accountant</b><small>Accounting, VAT · from the partner directory · 2 days ago · “We need October VAT filed.”</small></span><span><button className="ap-btn">Decline</button><button className="ap-primary" onClick={() => setTook(true)}><Check size={14} /> Take them on</button></span></div>}
              <div className="ap-tiles ap-4">
                <div className="ap-tile"><span>Tax deadlines passed</span><b style={{ color: '#b91c1c' }}>1</b><em>across your clients</em></div>
                <div className="ap-tile"><span>Due in 14 days</span><b style={{ color: '#b45309' }}>5</b><em>returns and payments</em></div>
                <div className="ap-tile"><span>Changed files to book</span><b>{file === 'booked' ? 0 : 1}</b><em>uploaded, not yet in use</em></div>
                <div className="ap-tile"><span>Answers from clients</span><b>2</b><em>to your requests</em></div>
              </div>
              {invited.length > 0 && <div className="ap-card pt-inv"><b>Invited</b>{invited.map((e) => <span key={e}>{e} <Chip t="Waiting for the owner" tone="grey" /></span>)}</div>}
              <div className="ap-card ap-table">
                <div className="ap-cardh"><b>Your clients</b><input className="pt-in" placeholder="Find a client" aria-label="Find a client" value={q} onChange={(e) => setQ(e.target.value)} /></div>
                {clients.map((k, i) => ({ k, i })).filter(({ k }) => k.name.toLowerCase().includes(q.toLowerCase())).map(({ k, i }) => (
                  <button key={k.name} className="ap-tr ap-row pt-client" onClick={() => open(i)}>
                    <span><b>{k.name}</b><small>{k.services}</small></span>
                    <span className="pt-chips">{k.chips.length ? k.chips.map(([t, tone]) => <Chip key={t} t={t} tone={tone} />) : <Chip t="Up to date" tone="green" />}</span>
                    <span className="pt-next hide-s">Next: {k.next}<small>Books touched {k.touched}</small></span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            </>}

            {page === 'client' && <>
              <div className="ap-h"><p><button className="pt-back" onClick={() => go('clients')}><ChevronLeft size={14} /> Clients</button> <Chip t="VAT registered" tone="green" /> {c.services}</p></div>
              <div className="ap-two">
                <div className="ap-card ap-table">
                  <div className="ap-cardh"><b>Returns and statements</b><i>Made from the client's books</i></div>
                  {FILES.map(([n, per], i) => (
                    <div key={n} className="ap-tr pt-file"><span><b>{n}</b><small>{per}</small></span>
                      {i === 0 && cid === 0 ? <Chip t={file === 'booked' ? 'Your version in use' : 'Waiting for you to book it'} tone={file === 'booked' ? 'green' : 'amber'} /> : <Chip t="TaxStreem's version" tone="grey" />}
                      <span className="pt-acts"><span className="ap-btn"><Download size={13} /> Excel</span><span className="ap-btn hide-s"><Upload size={13} /> Upload</span></span></div>
                  ))}
                </div>
                <div className="ap-card ap-table">
                  <div className="ap-cardh"><b>Tax deadlines</b><i>Oldest first</i></div>
                  {DUE.filter((d) => d[0] === Math.min(cid, 4)).concat(cid > 4 ? [[5, 'VAT return', 'Oct 2026', null, '21 Nov', false, 'vat']] : []).slice(0, 3).map((d) => <div key={d[1] + d[2]} className="ap-tr pt-due"><span><b>{d[1]}</b><small>{d[2]}</small></span><span>{d[3] != null ? N(d[3]) : ''}</span><Chip t={d[4]} tone={d[5] ? 'red' : 'grey'} /></div>)}
                </div>
              </div>
              {cid === 0 && file !== 'none' && (
                <div className="ap-card pt-review" data-done={file === 'booked' || undefined}>
                  <div className="ap-h"><div><h4 className="ap-big">{file === 'booked' ? 'Booked. TaxStreem now uses your version.' : 'What changed in your VAT return'}</h4><p>Compared with the file TaxStreem makes from the books. Your note: “One supplier invoice was dated October and posted in November.”</p></div></div>
                  <div className="pt-diff"><span>Line</span><span>TaxStreem</span><span>The file</span><span>Change</span><b>Input VAT</b><span>{N(439326)}</span><span>{N(452826)}</span><em>+{N(13500)}</em><b>VAT to pay</b><span>{N(685674)}</span><span>{N(672174)}</span><em>−{N(13500)}</em></div>
                  {file === 'review' && <><label className="pt-check"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} /><span>I take professional responsibility for these changes, and TaxStreem uses my version from now on.</span></label>
                    <div className="pt-acts"><button className="ap-btn" onClick={() => setFile('none')}>Withdraw this version</button><button className="ap-primary" disabled={!accept} onClick={() => setFile('booked')}>Book it and use my version</button></div></>}
                  {file === 'booked' && <p className="pt-ok"><Check size={15} /> Journal JE-0412 posted. The business sees your note and your licence beside the change.</p>}
                </div>
              )}
              <div className="ap-two">
                <div className="ap-card pt-stack">
                  <h4>Ask the business <em>The owner is told at once</em></h4>
                  <div className="ap-pills">{['A document', 'A question', 'An approval'].map((k) => <i key={k} data-on={kind === k || undefined} onClick={() => setKind(k)}>{k}</i>)}</div>
                  <form onSubmit={(e) => { e.preventDefault(); if (ask.trim()) { setReqs([[kind, ask.trim()], ...reqs]); setAsk('') } }}><input className="pt-in" placeholder="What you need, e.g. October bank statement" aria-label="What you need" value={ask} onChange={(e) => setAsk(e.target.value)} /><button className="ap-primary"><Send size={13} /> Send</button></form>
                  {reqs.map(([k, t], i) => <div key={t + i} className="pt-req"><span><b>{t}</b><small>{k}</small></span><Chip t={i === reqs.length - 1 ? 'Answered' : 'Sent to the business'} tone={i === reqs.length - 1 ? 'green' : 'blue'} /></div>)}
                </div>
                <div className="ap-card pt-stack">
                  <h4>The practice's notes <em>Only your practice sees these</em></h4>
                  <p className="pt-note">Owner prefers WhatsApp. Year-end is 31 October. Bank lines for the Lekki branch come in late.</p>
                  <h4>Who works on it</h4>
                  {TEAM.map(([n, r]) => <div key={n} className="pt-req"><span><b>{n}</b><small>{r}</small></span><Chip t={r === 'Staff' ? 'Assigned' : 'Every client'} tone="grey" /></div>)}
                </div>
              </div>
            </>}

            {page === 'deadlines' && <>
              <div className="ap-h"><p>Returns and payments every client owes, as TaxStreem works them out from their books.</p></div>
              <div className="ap-pills">{[['all', 'All'], ['vat', 'VAT'], ['wht', 'WHT'], ['cit', 'CIT']].map(([k, l]) => <i key={k} data-on={seg === k || undefined} onClick={() => setSeg(k)}>{l}</i>)}</div>
              <div className="ap-card ap-table">
                <div className="ap-tr ap-th pt-dl"><span>Client</span><span>What</span><span>Amount</span><span>Due</span></div>
                {DUE.filter((d) => seg === 'all' || d[6] === seg).map((d, i) => <button key={i} className="ap-tr ap-row pt-dl" onClick={() => open(d[0])}><b>{BASE[d[0]].name}</b><span>{d[1]} <small>{d[2]}</small></span><span>{d[3] != null ? N(d[3]) : ''}</span><Chip t={d[4]} tone={d[5] ? 'red' : 'grey'} /></button>)}
              </div>
            </>}

            {page === 'team' && <>
              <div className="ap-h"><p>Partners and managers see every client. Staff see the clients you assign them, and get a place in those businesses only.</p><button className="ap-primary" onClick={() => setAdding(true)}><Plus size={14} /> Add a person</button></div>
              {adding && <form className="ap-card pt-form" onSubmit={(e) => { e.preventDefault(); const v = String(new FormData(e.currentTarget).get('name') || '').trim(); if (v) { setPeople([...people, v]); setAdding(false) } }}>
                <b>They get an email with a link to join the practice</b><div><input name="name" placeholder="Name" aria-label="Name" /><button className="ap-primary">Add as staff</button><button type="button" className="ap-btn" onClick={() => setAdding(false)}>Cancel</button></div>
              </form>}
              <div className="ap-card ap-table">
                {TEAM.map(([n, r, l, tone]) => <div key={n} className="ap-tr pt-team"><span><b>{n}</b><small>{r === 'Partner' ? 'Runs the practice, every client' : r === 'Manager' ? 'Every client, can invite and assign' : 'The clients you assign'}</small></span><Chip t={r} tone="blue" /><Chip t={l} tone={tone} /></div>)}
                {people.map((n) => <div key={n} className="ap-tr pt-team"><span><b>{n}</b><small>The clients you assign</small></span><Chip t="Staff" tone="blue" /><Chip t="Invitation sent" tone="grey" /></div>)}
              </div>
            </>}

            {page === 'earnings' && <>
              <div className="ap-tiles ap-4">
                <div className="ap-tile"><span>Earned so far</span><b>{N(412500)}</b><em>{paying} paying businesses</em></div>
                <div className="ap-tile"><span>Waiting</span><b>{N(61500)}</b><em>each amount waits 30 days</em></div>
                <div className="ap-tile"><span>Ready to pay</span><b>{N(48000)}</b><em>paid on the 5th, from ₦5,000</em></div>
                <div className="ap-tile"><span>Paid to you</span><b>{N(303000)}</b><em>after 5% WHT</em></div>
              </div>
              <div className="ap-two">
                <div className="ap-card pt-stack">
                  <h4>Your link <em>Code BELO-7Q2M</em></h4>
                  <p className="pt-link">app.taxstreem.com/r/BELO-7Q2M</p>
                  <div className="pt-acts" style={{ justifyContent: 'flex-start' }}><button className="ap-primary" onClick={() => setCopied(true)}>{copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy link</>}</button><span className="ap-btn"><MessageCircle size={13} /> Share on WhatsApp</span></div>
                  <p className="pt-note">Businesses that join through it get 20% off their first payment.</p>
                </div>
                <div className="ap-card pt-stack">
                  <h4>Bronze partner <em>10% for 6 months</em></h4>
                  <p className="pt-note">You earn 10% of each payment, for 6 months from a business's first payment.</p>
                  <div className="pt-bar"><i style={{ width: `${paying * 10}%` }} /></div>
                  <p className="pt-note"><b>Progress to Silver:</b> {paying} of 10 paying businesses. Silver earns 15%, Gold 18% from 25.</p>
                  <div className="pt-miles">{[[5, 25000], [10, 75000], [25, 200000]].map(([n, b]) => <span key={n} data-done={paying >= n || undefined}>{paying >= n && <Check size={12} />}{N(b)} at {n}</span>)}</div>
                </div>
              </div>
              <div className="ap-card ap-table">
                <div className="ap-cardh"><b>Businesses you brought</b><i>Each counts from its first paid plan</i></div>
                {[['Adaeze Foods Limited', 'Earning, month 4 of 6', 90000], ['Lekki Print Hub', 'Earning, month 2 of 6', 36000], ['Emberline Software Limited', 'Earning, month 5 of 6', 112500], ...(took ? [['Harbour Clinic', 'Waiting for the first payment', 0] as const] : [])].map(([n, st, e]) => <div key={n as string} className="ap-tr pt-team"><b>{n}</b><span>{st}</span><span style={{ textAlign: 'right' }}>{N(e as number)}</span></div>)}
              </div>
            </>}

            {page === 'billing' && <>
              <div className="ap-h"><p>Pay for clients' TaxStreem plans with the practice's card. Each client's owner sees that you pay, and can take it back at any time.</p></div>
              <div className="ap-card ap-table">
                <div className="ap-cardh"><b>Clients</b><i>Who pays for the plan</i></div>
                {BASE.map((k) => <div key={k.name} className="ap-tr pt-team"><b>{k.name}</b><Chip t={pays[k.name] ? 'You pay · Growth, monthly' : 'The business pays'} tone={pays[k.name] ? 'blue' : 'grey'} /><button className="ap-btn" onClick={() => setPays({ ...pays, [k.name]: !pays[k.name] })}>{pays[k.name] ? 'Stop' : 'Pay for them'}</button></div>)}
              </div>
              <div className="ap-two">
                <div className="ap-card pt-stack"><h4>Cards <em>Kept for renewals</em></h4><div className="pt-req"><span><b>Visa ending 4410</b><small>Expires 08/28</small></span><Chip t="In use" tone="green" /></div></div>
                <div className="ap-card pt-stack"><h4>Payments</h4><div className="pt-req"><span><b>Lekki Print Hub · Growth</b><small>1 Nov 2026</small></span><span>{N(75000)}</span></div><div className="pt-req"><span><b>Lekki Print Hub · Growth</b><small>1 Oct 2026</small></span><span>{N(75000)}</span></div></div>
              </div>
            </>}

            {page === 'practice' && <>
              <div className="ap-h"><p>What clients see of your practice, and your own professional licence.</p></div>
              <div className="ap-two">
                <div className="ap-card pt-stack">
                  <h4>Your licence <em>Clients see it beside your name</em></h4>
                  <div className="ap-pills">{['ICAN', 'ANAN', 'CITN', 'NBA'].map((k) => <i key={k} data-on={body === k || undefined} onClick={() => setBody(k)}>{k}</i>)}</div>
                  <div className="pt-req"><span><b>Membership number</b><small>MB 0•••• 41</small></span><Chip t="Verified by TaxStreem" tone="green" /></div>
                  <p className="pt-note"><ShieldCheck size={14} /> It goes into the statement you accept when you change a return.</p>
                </div>
                <div className="ap-card pt-stack">
                  <h4>The practice <em>A partner changes these</em></h4>
                  {[['Name', 'Bello & Eze Chartered Accountants'], ['It is', 'A firm'], ['Email', 'hello@belloeze.ng'], ['State', 'Lagos'], ['Firm registration', 'ICAN/F/2019/0•••']].map(([k, v]) => <div key={k} className="pt-req"><span><small>{k}</small><b>{v}</b></span></div>)}
                </div>
              </div>
            </>}
          </div>
        </div>
      </div>
      <p className="lp-note">This is the accountant portal with sample data. <span>Nothing you click here is sent anywhere.</span></p>
    </div>
  )
}
