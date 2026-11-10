'use client'
import { Building2, CalendarDays, Users, Award, CreditCard, Settings } from 'lucide-react'
import { Stage, Window, Count, States, Badge, Button, Check, type Act } from '../kit'
import { asset } from '../lib/asset'
import './hero-film.css'
import './sol-film.css'

// The accountant portal in one pass: take on a business that asked for you, book a return you changed, see what the practice earned.

type Scene = 'clients' | 'client' | 'earn'
type S = { scene: Scene; took: boolean; accept: boolean; booked: boolean; earned: number }
const initial: S = { scene: 'clients', took: false, accept: false, booked: false, earned: 0 }
const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const REST = { wide: { x: 880, y: 480 }, compact: { x: 300, y: 440 } }
const CLIENTS: [string, string, string, 'warning' | 'danger' | 'success'][] = [['Adaeze Foods Limited', '1 changed file to book', 'VAT 21 Nov', 'warning'], ['Lekki Print Hub', 'WHT deadline passed', 'VAT 21 Nov', 'danger'], ['Northgate Schools', 'Up to date', 'CIT 30 Jun', 'success']]

async function script(a: Act<S>) {
  await a.wait(1000)
  await a.move('take'); await a.wait(180); await a.click(); await a.set({ took: true })
  await a.wait(1100); await a.move('row'); await a.wait(160); await a.click(); await a.set({ scene: 'client' })
  await a.wait(1100); await a.move('tick'); await a.wait(160); await a.click(); await a.set({ accept: true })
  await a.wait(500); await a.move('book'); await a.wait(160); await a.click(); await a.set({ booked: true })
  await a.wait(1400)
  if (a.layout === 'wide') { await a.move('nav-earn'); await a.wait(140); await a.click() }
  await a.set({ scene: 'earn' }); await a.wait(500); await a.set({ earned: 412500 })
  await a.move('rest'); await a.wait(3800); await a.set({ ...initial }); await a.wait(500)
}

const NAV: [string, React.ReactNode, Scene | null][] = [['Clients', <Building2 key="i" size={15} />, 'clients'], ['Deadlines', <CalendarDays key="i" size={15} />, null], ['Team', <Users key="i" size={15} />, null], ['Earnings', <Award key="i" size={15} />, 'earn'], ['Billing', <CreditCard key="i" size={15} />, null], ['Practice', <Settings key="i" size={15} />, null]]
const TITLE: Record<Scene, [string, string]> = { clients: ['Clients', 'practice/clients'], client: ['Adaeze Foods Limited', 'practice/clients/adaeze-foods'], earn: ['Earnings', 'practice/earnings'] }

export function PortalTour() {
  return (
    <Stage<S> width={1040} height={560} compact={{ below: 700, width: 358, height: 500 }} initial={initial} poster={{ scene: 'earn', took: true, accept: true, booked: true, earned: 412500 }} script={script} accent="#0072F5" greys="cool" cursor={{ at: REST }} className="hf sf pf">
      {(s, _r, layout) => (
        <>
          <Window url={`app.taxstreem.com/${TITLE[s.scene][1]}`} className="hf-win">
            <div className="hf-app">
              <aside className="hf-side">
                <img src={asset('/brand/taxstreem-logo-blue.svg')} alt="" className="hf-logo" />
                <span className="pf-badge">Accountant portal</span>
                {NAV.map(([l, icon, sc]) => <div key={l} className="hf-nav" data-on={(sc === s.scene || (sc === 'clients' && s.scene === 'client')) || undefined} data-target={sc === 'earn' ? 'nav-earn' : undefined} data-cursor="hand">{icon}<span>{l}</span></div>)}
                <div className="hf-org"><i>BE</i><span><b>Bello & Eze Chartered Accountants</b><em>Partner</em></span></div>
              </aside>
              <main className="hf-main">
                <header className="hf-top"><States value={s.scene} align="start" states={{ clients: <b>Clients</b>, client: <b>Adaeze Foods Limited</b>, earn: <b>Earnings</b> }} /></header>

                <section className="hf-scene" data-on={s.scene === 'clients' || undefined}>
                  <div className="hf-card pf-ask"><span className="hf-body"><b>Harbour Clinic asks you to be their accountant</b><i>Accounting, VAT · from the partner directory</i></span>
                    <span className="hf-act" data-target="take" data-cursor="hand"><States value={s.took ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary">Take them on</Button>, y: <Badge tone="success" icon={<Check on size={12} />}>Added to your clients</Badge> }} /></span></div>
                  <div className="hf-tiles">
                    <div className="hf-tile" data-live={s.took || undefined}><span>Businesses you look after</span><b><Count value={s.took ? 6 : 5} /></b><em>each on its own books</em></div>
                    <div className="hf-tile"><span>Due in 14 days</span><b>5</b><em>returns and payments</em></div>
                    <div className="hf-tile hf-pay"><span>Changed files to book</span><b>1</b><em>uploaded, not yet in use</em></div>
                  </div>
                  <div className="hf-card hf-tbl pf-clients">
                    {CLIENTS.map(([n, chip, next, tone], i) => <div key={n} className="hf-tr" data-target={i === 0 ? 'row' : undefined} data-cursor="hand"><span><b>{n}</b></span><span><Badge tone={tone}>{chip}</Badge></span><span className="hf-rcpt">Next: {next}</span></div>)}
                  </div>
                </section>

                <section className="hf-scene" data-on={s.scene === 'client' || undefined}>
                  <div className="hf-bankh"><span className="hf-body"><b>VAT return, October 2026</b><i>Your changed file, compared with the one made from the books</i></span>
                    <States value={s.booked ? 'y' : 'n'} align="end" states={{ n: <Badge tone="warning">Waiting for you to book it</Badge>, y: <Badge tone="success" icon={<Check on size={12} />}>Your version in use</Badge> }} /></div>
                  <div className="hf-card hf-tbl pf-diff">
                    <div className="hf-tr hf-th"><span>Line</span><span>TaxStreem</span><span>The file</span><span>Change</span></div>
                    <div className="hf-tr"><span><b>Input VAT</b></span><span>{naira(439326)}</span><span>{naira(452826)}</span><span className="pf-chg">+{naira(13500)}</span></div>
                    <div className="hf-tr"><span><b>VAT to pay</b></span><span>{naira(685674)}</span><span>{naira(672174)}</span><span className="pf-chg">−{naira(13500)}</span></div>
                  </div>
                  <div className="hf-card pf-accept" data-on={s.accept || undefined}><span data-target="tick" data-cursor="hand"><Check on={s.accept} size={18} /></span><span className="hf-body"><b>I take professional responsibility for these changes</b><i>TaxStreem uses my version from now on, with my licence beside it</i></span>
                    <span className="hf-act" data-target="book" data-cursor="hand"><States value={s.booked ? 'y' : 'n'} align="end" states={{ n: <Button variant="primary" style={{ opacity: s.accept ? 1 : 0.45 }}>Book it and use my version</Button>, y: <span className="hf-rcpt">Journal JE-0412 posted</span> }} /></span></div>
                </section>

                <section className="hf-scene" data-on={s.scene === 'earn' || undefined}>
                  <div className="hf-tiles">
                    <div className="hf-tile" data-live={s.earned > 0 || undefined}><span>Earned so far</span><b><Count value={s.earned} format={naira} /></b><em>8 paying businesses</em></div>
                    <div className="hf-tile"><span>Ready to pay</span><b>{naira(48000)}</b><em>paid on the 5th of the month</em></div>
                    <div className="hf-tile hf-pay"><span>Bronze partner</span><b>10%</b><em>of each payment, for 6 months</em></div>
                  </div>
                  <div className="hf-card pf-prog"><span className="hf-body"><b>Progress to Silver</b><i>8 of 10 paying businesses · Silver earns 15%</i></span><span className="pf-bar"><i style={{ width: s.earned ? '80%' : '0%' }} /></span></div>
                  <div className="hf-card hf-tbl pf-clients">
                    {[['Emberline Software Limited', 'Earning, month 5 of 6', 112500], ['Adaeze Foods Limited', 'Earning, month 4 of 6', 90000], ['Harbour Clinic', 'Waiting for the first payment', 0]].map(([n, st, e]) => <div key={n as string} className="hf-tr"><span><b>{n}</b></span><span className="hf-rcpt">{st}</span><span className="hf-rcpt">{naira(e as number)}</span></div>)}
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
