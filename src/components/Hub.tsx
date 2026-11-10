import { asset } from '../lib/asset'

/* Integration hub. The moving light along each connector follows Magic UI's AnimatedBeam (MIT), redrawn in plain SVG and CSS. */
const LEFT = [['mono', 'Mono'], ['paystack', 'Paystack'], ['flutterwave', 'Flutterwave'], ['moniepoint', 'Moniepoint'], ['quickbooks', 'QuickBooks']] as const
const RIGHT = [['nrs', 'Nigeria Revenue Service'], ['lirs', 'Lagos State Internal Revenue Service'], ['cac', 'Corporate Affairs Commission'], ['whatsapp', 'WhatsApp']] as const
const ys = (n: number) => Array.from({ length: n }, (_, i) => 40 + (i * 320) / (n - 1))

export function Hub({ dark }: { dark?: boolean }) {
  const d = dark ? '-dark' : ''
  const L = ys(LEFT.length), R = ys(RIGHT.length)
  return (
    <div className="hub" data-bare={dark || undefined} role="img" aria-label="Banks, payment providers and accounting software connect to TaxStreem, which connects to the NRS, LIRS, CAC and WhatsApp">
      <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden>
        {L.map((y, i) => <g key={'l' + i}><path d={`M 170 ${y} C 330 ${y}, 340 200, 500 200`} className="hub-base" /><path d={`M 170 ${y} C 330 ${y}, 340 200, 500 200`} className="hub-run" pathLength={100} style={{ animationDelay: `${i * -0.9}s` }} /></g>)}
        {R.map((y, i) => <g key={'r' + i}><path d={`M 500 200 C 660 200, 670 ${y}, 830 ${y}`} className="hub-base" /><path d={`M 500 200 C 660 200, 670 ${y}, 830 ${y}`} className="hub-run out" pathLength={100} style={{ animationDelay: `${i * -1.1 - 1.4}s` }} /></g>)}
      </svg>
      <ul className="hub-col hub-l">{LEFT.map(([f, n]) => <li key={f}><img src={asset(`/partners/${f}${d}.png`)} alt={n} loading="lazy" /></li>)}</ul>
      <div className="hub-core"><img src={asset('/brand/taxstreem-icon-white.svg')} alt="TaxStreem" /></div>
      <ul className="hub-col hub-r">{RIGHT.map(([f, n]) => <li key={f}><img src={asset(`/partners/${f}${d}.png`)} alt={n} loading="lazy" /></li>)}</ul>
    </div>
  )
}
