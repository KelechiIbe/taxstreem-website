import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Buttons } from '../components/Blocks'
import { COPY } from '../content/pages'

export default function NotFound() {
  const b = COPY['Page not found'] as { x: string }[]
  return (
    <>
      <Header />
      <main className="pg"><section className="pg-hero nf"><div className="wrap pg-hero-in"><div className="pg-hero-copy"><h1>{b[0].x}</h1><p className="lede">{b[1].x}</p><Buttons text={b[2].x} /></div></div></section></main>
      <Footer />
    </>
  )
}
