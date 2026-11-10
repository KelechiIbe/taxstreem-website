'use client'
import { useState } from 'react'

const naira = (n: number) => '₦' + Math.round(n).toLocaleString('en-US')
const TABS = [
  ['in', 'Money in', 'Invoices that carry the right VAT and reach the NRS.'],
  ['out', 'Money out', 'Bills checked for errors before you pay.'],
  ['stock', 'Inventory', 'Stock goes up when the invoice is approved. Countev tells you what to count next.'],
  ['books', 'Books', 'You answer the doubtful ones. The rest is recorded for you.'],
  ['tax', 'Tax', 'Output VAT, input VAT, what you owe. Filed from here.'],
] as const
type Tab = (typeof TABS)[number][0]

export function LiveProduct() {
  const [tab, setTab] = useState<Tab>('in')
  const [invoiced, setInvoiced] = useState(false)
  const [approved, setApproved] = useState(false)
  const [received, setReceived] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [filed, setFiled] = useState<'no' | 'busy' | 'yes'>('no')

  const output = 1125000 + (invoiced ? 63750 : 0)
  const input = approved ? 439326 : 0
  const revenue = 15000000 + (invoiced ? 850000 : 0)
  const expenses = 9420000 + (approved ? 5857674 : 0) + (answer === 'Diesel and generator' ? 150000 : 0)
  const caption = TABS.find((t) => t[0] === tab)![2]
  const file = () => {
    setFiled('busy')
    setTimeout(() => setFiled('yes'), 1400)
  }
  const reset = () => {
    setInvoiced(false); setApproved(false); setReceived(false); setAnswer(null); setFiled('no'); setTab('in')
  }

  return (
    <div className="live">
      <div className="live-tabs" role="tablist" aria-label="Product areas">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className="live-tab" onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className="live-frame">
        <div className="live-bar">
          <span className="live-dots" aria-hidden><i /><i /><i /></span>
          <span className="live-url">app.taxstreem.com</span>
          <button className="live-reset" onClick={reset}>Start again</button>
        </div>
        <div className="live-body" role="tabpanel">
          {tab === 'in' && (
            <div className="live-grid">
              <div className="card">
                <h4>New invoice</h4>
                <dl className="kv">
                  <div><dt>Customer</dt><dd>Elysium Technologies</dd></div>
                  <div><dt>Service</dt><dd>Brand strategy retainer, November</dd></div>
                  <div><dt>Amount</dt><dd>{naira(850000)}</dd></div>
                  <div data-new={invoiced || undefined}><dt>VAT at 7.5%</dt><dd>{invoiced ? naira(63750) : 'Added when you create it'}</dd></div>
                  <div data-new={invoiced || undefined}><dt>Total</dt><dd><b>{invoiced ? naira(913750) : naira(850000)}</b></dd></div>
                </dl>
                <button className="btn btn-primary" disabled={invoiced} onClick={() => setInvoiced(true)}>
                  {invoiced ? 'Invoice created' : 'Create invoice'}
                </button>
              </div>
              <div className="card card-quiet" data-on={invoiced || undefined}>
                <h4>E-invoice</h4>
                {invoiced ? (
                  <>
                    <p className="ok">Validated by the NRS</p>
                    <p className="mono">IRN INV00412-7C4E91A2-20261110</p>
                    <div className="qr" aria-label="QR code placeholder" />
                    <p className="dim">Sent to the customer by email and WhatsApp.</p>
                  </>
                ) : (
                  <p className="dim">Create the invoice and its NRS reference appears here.</p>
                )}
              </div>
            </div>
          )}
          {tab === 'out' && (
            <div className="live-grid">
              <div className="card">
                <h4>Supplier bill, read from a photo</h4>
                <dl className="kv">
                  <div><dt>Supplier</dt><dd>Emberline Software Limited</dd></div>
                  <div><dt>Tax ID</dt><dd>Checked with the NRS <span className="tick">✓</span></dd></div>
                  <div><dt>Net</dt><dd>{naira(5857674)}</dd></div>
                  <div><dt>VAT</dt><dd>{naira(439326)}</dd></div>
                  <div><dt>Total</dt><dd><b>{naira(6297000)}</b></dd></div>
                </dl>
                <button className="btn btn-primary" disabled={approved} onClick={() => setApproved(true)}>
                  {approved ? 'Approved and paid' : 'Approve and pay'}
                </button>
              </div>
              <div className="card card-quiet" data-on={approved || undefined}>
                <h4>What TaxStreem checked</h4>
                <ul className="checks">
                  <li>The sums on the invoice add up</li>
                  <li>This invoice number has not been paid before</li>
                  <li>The supplier&rsquo;s Tax ID is valid</li>
                  <li data-on={approved || undefined}>{approved ? `Input VAT of ${naira(439326)} added to your November return` : 'Input VAT is claimed once you pay'}</li>
                </ul>
              </div>
            </div>
          )}
          {tab === 'stock' && (
            <div className="live-grid">
              <div className="card">
                <h4>Receive from the Emberline bill</h4>
                <table className="tbl">
                  <thead><tr><th>Item</th><th>Qty</th><th>Ikeja branch</th></tr></thead>
                  <tbody>
                    <tr><td>POS terminals</td><td>8</td><td>{received ? 20 : 12}</td></tr>
                    <tr><td>Receipt printers</td><td>4</td><td>{received ? 9 : 5}</td></tr>
                  </tbody>
                </table>
                <button className="btn btn-primary" disabled={received || !approved} onClick={() => setReceived(true)}>
                  {received ? 'Received into Ikeja' : approved ? 'Receive into Ikeja' : 'Approve the bill first'}
                </button>
              </div>
              <div className="card card-quiet" data-on>
                <h4>Count these next</h4>
                <ul className="risk">
                  <li><b>Receipt paper rolls</b><span>Sold 40, stock fell by 52</span></li>
                  <li><b>50kg rice</b><span>Two price changes this quarter</span></li>
                  <li><b>Phone chargers</b><span>Not counted for 21 days</span></li>
                </ul>
              </div>
            </div>
          )}
          {tab === 'books' && (
            <div className="live-grid">
              <div className="card">
                <h4>One question from Atlas</h4>
                <p>What was the {naira(150000)} paid to Total Energies on 9 November for?</p>
                <div className="opts">
                  {['Diesel and generator', 'Vehicle fuel', 'Owner’s personal spend'].map((o, i) => (
                    <button key={o} className="opt" aria-pressed={answer === o} onClick={() => setAnswer(o)}>
                      <span>{o}</span>
                      {i === 0 && <em>Best guess, 71% sure</em>}
                    </button>
                  ))}
                </div>
                <p className="dim">{answer ? 'Recorded. Atlas will do the same next time for this payee.' : 'Tap one. Each answer can teach it a rule.'}</p>
              </div>
              <div className="card card-quiet" data-on>
                <h4>Profit and loss, November</h4>
                <dl className="kv">
                  <div><dt>Revenue</dt><dd>{naira(revenue)}</dd></div>
                  <div><dt>Expenses</dt><dd>{naira(expenses)}</dd></div>
                  <div><dt>Profit</dt><dd><b>{naira(revenue - expenses)}</b></dd></div>
                </dl>
              </div>
            </div>
          )}
          {tab === 'tax' && (
            <div className="live-grid">
              <div className="card">
                <h4>VAT return, November 2026</h4>
                <dl className="kv">
                  <div><dt>Output VAT</dt><dd>{naira(output)}</dd></div>
                  <div><dt>Input VAT</dt><dd>{naira(input)}</dd></div>
                  <div><dt>VAT to pay</dt><dd><b>{naira(output - input)}</b></dd></div>
                </dl>
                <button className="btn btn-primary" disabled={filed !== 'no'} onClick={file}>
                  {filed === 'no' ? 'File return' : filed === 'busy' ? 'Filing with NRS…' : 'Filed with NRS'}
                </button>
              </div>
              <div className="card card-quiet" data-on={filed === 'yes' || undefined}>
                <h4>Receipt</h4>
                {filed === 'yes' ? (
                  <>
                    <p className="ok">Filed with the Nigeria Revenue Service</p>
                    <p className="mono">Acknowledgement VAT-2026-11-0048213</p>
                    <p className="dim">Saved in Documents. Payment is due by 21 December.</p>
                  </>
                ) : (
                  <p className="dim">{approved ? 'Your input VAT is in. Press File.' : 'Tip: approve the supplier bill under Money out and watch input VAT change here.'}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="live-caption">{caption} <span>Sample data. Nothing here is sent anywhere.</span></p>
    </div>
  )
}
