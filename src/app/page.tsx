import { ArrowRight, ReceiptText, HandCoins, Landmark, FileCheck2, Timer, Scale, ShieldCheck, Lock, KeyRound, FileBadge } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Faq'
import { LiveProduct } from '../components/LiveProduct'
import { HeroFilm } from '../demos/HeroFilm'
import { MartinaChat } from '../demos/MartinaChat'
import { ConnectFilm, ReviewFilm, FileFilm, EInvoiceFilm, InventoryFilm } from '../demos/MiniFilms'
import { Aurora, Grain } from '../components/Backdrop'
import { Photo } from '../components/Photo'
import { LINKS, RESULTS, PRODUCTS, STEPS, FAQ, PARTNER_LOGOS } from '../content/site'
import { asset } from '../lib/asset'

const RICON: Record<string, React.ReactNode> = {
  vat: <ReceiptText />, owed: <HandCoins />, books: <Landmark />, file: <FileCheck2 />, team: <Timer />, recon: <Scale />,
}
const PHOTO_BRIEFS = [
  'Two or three professionals in a small agency or consulting office. Landscape.',
  'A shopkeeper or pharmacist serving a walk-in customer at the counter. Landscape.',
  'A freelancer working alone on a laptop at home or in a caf\u00e9. Landscape.',
  'An accountant reviewing papers with a client across a desk. Landscape.',
]
const FILMS = [<ConnectFilm key="c" />, <ReviewFilm key="r" />, <FileFilm key="f" />]
const PRESS = ['Punch', 'ThisDay', 'Techparley', 'Technaija', 'Innovation Village', 'The CFO Magazine']

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'TaxStreem', legalName: 'TaxStreem Technologies Inc.', url: 'https://www.taxstreem.com', logo: 'https://www.taxstreem.com/brand/taxstreem-logo-blue.svg', areaServed: 'NG', email: 'hello@taxstreem.com' },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'TaxStreem', url: 'https://www.taxstreem.com' },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
]

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Grain />
      <Header />
      <main>
        <section className="hero">
          <Aurora />
          <div className="wrap hero-in">
            <p className="kicker rise" style={{ ['--d' as string]: '0ms' }}>Tax and bookkeeping for African businesses. Live in Nigeria.</p>
            <h1 className="rise" style={{ ['--d' as string]: '80ms' }}>Do your books once.<br />Your taxes follow.</h1>
            <p className="lede rise" style={{ ['--d' as string]: '160ms' }}>
              TaxStreem keeps your books from your bank, sales and supplier invoices. Then it prepares and files your VAT, WHT, CIT and PIT returns with the Nigeria Revenue Service (NRS) and your State Internal Revenue Service. You check and approve.
            </p>
            <div className="cta-row rise" style={{ ['--d' as string]: '240ms' }}>
              <a className="btn btn-primary btn-lg" href={LINKS.start}>Sign Up <ArrowRight size={16} /></a>
              <a className="btn btn-ghost btn-lg" href="#products">See the products</a>
            </div>
            <p className="fine rise" style={{ ['--d' as string]: '300ms' }}>Set up in a day. Cancel any time.</p>
          </div>
          <div className="wrap hero-film rise" style={{ ['--d' as string]: '380ms' }}>
            <HeroFilm />
          </div>
        </section>

        <section className="proof">
          <div className="wrap proof-in">
            <p>As covered in</p>
            <ul className="press">{PRESS.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="backers">
              <span>Supported by</span>
              <img src={asset('/partners/nvidia-inception.png')} alt="NVIDIA Inception Program" height={34} />
              <img src={asset('/partners/google-for-startups.png')} alt="Google for Startups" height={20} />
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <Reveal className="sec-head">
              <p className="kicker">What changes</p>
              <h2>Six results you can check at month-end.</h2>
            </Reveal>
            <ul className="results">
              {RESULTS.map((r, i) => (
                <Reveal as="li" key={r.key} delay={i * 60} className="result">
                  <a href={r.href}>
                    <span className="result-ic">{RICON[r.key]}</span>
                    <h3>{r.title}</h3>
                    <p>{r.copy}</p>
                    <span className="more">See how <ArrowRight size={14} /></span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec sec-tint" id="products">
          <div className="wrap">
            <Reveal className="sec-head">
              <p className="kicker">Four products, one login</p>
              <h2>Start with the one built for how you work.</h2>
            </Reveal>
            <ul className="products">
              {PRODUCTS.map((p, i) => (
                <Reveal as="li" key={p.name} delay={i * 70} className="product">
                  <a href={p.href}>
                    <Photo n={i + 1} brief={PHOTO_BRIEFS[i]} ratio="4 / 3" />
                    <span className="product-n">0{i + 1}</span>
                    <h3>{p.name}</h3>
                    <p className="product-who">{p.who}</p>
                    <p>{p.what}</p>
                    <span className="more">{p.cta} <ArrowRight size={14} /></span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <Reveal className="sec-head">
              <p className="kicker">Three steps</p>
              <h2>From bank alert to filed return.</h2>
            </Reveal>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 90}>
                  <div className="step-film">{FILMS[i]}</div>
                  <span className="step-n">{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.copy}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec sec-dark" id="try">
          <Aurora tone="dark" />
          <div className="wrap">
            <Reveal className="sec-head">
              <p className="kicker">Try it here</p>
              <h2>Click through a month in TaxStreem.</h2>
            </Reveal>
            <Reveal><LiveProduct /></Reveal>
          </div>
        </section>

        <section className="sec">
          <div className="wrap split">
            <Reveal className="split-copy">
              <p className="kicker">Countev</p>
              <h2>Inventory that watches itself.</h2>
              <p className="lede">AI agents track what you hold in every branch, what it is worth, what is selling and what is going missing. Each morning they pick the items most likely to have lost money and ask someone to count them.</p>
              <a className="btn btn-ghost" href="/countev">See Countev <ArrowRight size={16} /></a>
            </Reveal>
            <Reveal className="stack" delay={120}>
              <Photo n={5} brief="A shop or pharmacy owner checking shelves with a phone in hand. Portrait." ratio="4 / 5" />
              <div className="film"><InventoryFilm /></div>
            </Reveal>
          </div>
        </section>

        <section className="sec sec-tint">
          <div className="wrap split split-rev">
            <Reveal className="split-copy">
              <p className="kicker">Meet Martina</p>
              <h2>Martina watches your numbers and tells you first.</h2>
              <p className="lede">Martina is the AI agent inside TaxStreem. She works on WhatsApp and by phone, in English, Pidgin, Yoruba, Hausa or Igbo. She tells you when the margin on a product starts to shrink and shows you where money or stock is leaking. She keeps the list of customers who owe you, with how long each has owed, then reminds them and phones the ones who stay silent. Ask her anything about your books and she answers from your own figures. Your VAT return still goes in on time.</p>
              <a className="btn btn-ghost" href="/martina">Meet Martina <ArrowRight size={16} /></a>
            </Reveal>
            <Reveal className="stack-phone" delay={120}>
              <Photo n={6} brief="A business owner reading a message on a phone, at a desk or counter. Portrait, subject on the right." ratio="auto" />
              <MartinaChat />
            </Reveal>
          </div>
        </section>

        <section className="sec">
          <div className="wrap duo">
            <Reveal className="duo-card">
              <p className="kicker">E-invoicing</p>
              <h2>Ready for NRS e-invoicing before it reaches you.</h2>
              <p>Nigeria is moving every business to electronic invoices validated by the NRS. TaxStreem sends each invoice to the NRS, returns it with its Invoice Reference Number and QR code, and delivers it to your customer. TaxStreem&rsquo;s accreditation as a System Integrator and Access Point Provider is in progress.</p>
              <div className="duo-film"><EInvoiceFilm /></div>
              <a className="more" href="/e-invoicing">See how e-invoicing works <ArrowRight size={14} /></a>
            </Reveal>
            <Reveal className="duo-card duo-dark" delay={100}>
              <p className="kicker">For fintechs, banks and business platforms</p>
              <h2>Offer tax to your customers without building it.</h2>
              <p>Tax computation, e-invoicing, inventory management, bookkeeping and filing are available through one API. Your customers stay in your product. TaxStreem does the tax work behind it.</p>
              <pre aria-label="Example API call"><code>{`POST /v1/vat/compute\n{ "amount": 850000, "inclusive": false }\n\n200 OK\n{ "vat": 63750, "rate": 0.075, "total": 913750 }`}</code></pre>
              <div className="cta-row">
                <a className="more" href="/embedded-infrastructure">See embedded infrastructure <ArrowRight size={14} /></a>
                <a className="more" href={LINKS.dev} target="_blank" rel="noopener">Read the API docs <ArrowRight size={14} /></a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="sec sec-tight">
          <div className="wrap">
            <Reveal className="logos-head">
              <p>Connected to the banks, payment providers and tax portals you already use.</p>
              <a className="more" href="/integrations">See all integrations <ArrowRight size={14} /></a>
            </Reveal>
            <div className="marquee" aria-label="Integrations">
              <ul>
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map(([f, n], i) => (
                  <li key={i} aria-hidden={i >= PARTNER_LOGOS.length || undefined}><img src={asset(`/partners/${f}.png`)} alt={n} loading="lazy" /></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="sec sec-tint">
          <div className="wrap">
            <Reveal className="sec-head">
              <p className="kicker">Security</p>
              <h2>Your financial data is handled with care.</h2>
            </Reveal>
            <ul className="trust">
              <Reveal as="li"><Lock /><p>Data is encrypted in transit and at rest.</p></Reveal>
              <Reveal as="li" delay={60}><KeyRound /><p>E-invoicing keys are held in a hardware security module.</p></Reveal>
              <Reveal as="li" delay={120}><ShieldCheck /><p>Access is by role, with two-step sign-in for owners.</p></Reveal>
              <Reveal as="li" delay={180}><FileBadge /><p>TaxStreem complies with the Nigeria Data Protection Act (NDPA) and GDPR. ISO 27001:2022 certification is in progress.</p></Reveal>
            </ul>
            <p className="center"><a className="more" href="/security">Visit the Trust Centre <ArrowRight size={14} /></a></p>
          </div>
        </section>

        <section className="sec">
          <div className="wrap narrow">
            <Reveal className="sec-head"><h2>Common questions</h2></Reveal>
            <Faq />
          </div>
        </section>

        <section className="closing">
          <Aurora tone="blue" />
          <div className="wrap closing-in">
            <Reveal>
              <h2>Month-end is coming. Have it done.</h2>
              <p>Set up takes a day. Your first reconciled month takes about a week.</p>
              <div className="cta-row">
                <a className="btn btn-white btn-lg" href={LINKS.start}>Sign Up <ArrowRight size={16} /></a>
                <a className="btn btn-outline btn-lg" href="/contact">Talk to us</a>
              </div>
            </Reveal>
            <Reveal delay={120}><Photo n={7} brief="A small team at work in a Lagos office, relaxed, laptops open. Landscape." ratio="4 / 3" /></Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
