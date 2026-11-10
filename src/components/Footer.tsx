import { LINKS, NAV } from '../content/site'
import { asset, link } from '../lib/asset'
import { Newsletter } from './Newsletter'

const col = (label: string) => NAV.find((n) => n.label === label)!.groups!.flatMap((g) => g.links)
const COLS: [string, { label: string; href: string; external?: boolean }[]][] = [
  ['Products', [...col('Products'), { label: 'Pricing', href: '/pricing' }]],
  ['Developers', [...col('Developers'), { label: 'Modules', href: '/modules' }]],
  ['Resources', col('Resources').filter((l) => !['All Resources', 'Newsroom', 'Demos', 'Reports & Analysis'].includes(l.label))],
  ['Company', col('Company')],
  ['Legal and trust', [
    { label: 'Trust Centre', href: '/security' }, { label: 'Privacy', href: LINKS.privacy }, { label: 'Terms', href: LINKS.terms }, { label: 'Service level agreement', href: '/security' },
  ]],
]

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-top">
          <img src={asset('/brand/taxstreem-logo-white.svg')} alt="TaxStreem" width={140} height={26} />
          <p>Tax and accounting infrastructure for African businesses. Live in Nigeria.</p>
        </div>
        <div className="ftr-news" id="newsletter"><Newsletter id="news-footer" /></div>
        <div className="ftr-cols">
          {COLS.map(([h, links]) => (
            <nav key={h} aria-label={h}>
              <h3>{h}</h3>
              <ul>
                {links.map((l) => (
                  <li key={l.label}><a href={link(l.href)} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener' : undefined}>{l.label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ftr-base">
          <span>© 2026 TaxStreem Technologies Inc. Lagos, Nigeria and Delaware, USA.</span>
          <span>NDPA and GDPR compliant · ISO 27001:2022 in progress</span>
        </div>
      </div>
    </footer>
  )
}
