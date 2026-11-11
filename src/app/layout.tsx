import { StackFx } from '../components/StackFx'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.taxstreem.com'),
  title: 'TaxStreem: accounting and tax filing software for Nigerian businesses',
  description: 'Keep your books, recover input VAT and file VAT, WHT, CIT and PIT returns with the NRS and State Internal Revenue Services from one place.',
  openGraph: { title: 'TaxStreem', description: 'Accounting and tax filing software for Nigerian businesses.', type: 'website', locale: 'en_NG', siteName: 'TaxStreem', images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'TaxStreem' }] },
  twitter: { card: 'summary_large_image', site: '@taxstreem' },
  icons: { icon: (process.env.NEXT_PUBLIC_BASE ?? '') + '/brand/taxstreem-icon-blue.svg' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' }

const B = process.env.NEXT_PUBLIC_BASE ?? ''
const face = (family: string, file: string, range: string) => `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:100 900;src:url(${B}/fonts/${file}.woff2) format('woff2-variations');unicode-range:${range}}`
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
// Preview host only: it can open a page already scrolled, so each page is put back at its top until the visitor scrolls.
const TOP = `(function(){try{history.scrollRestoration='manual'}catch(e){}var u=false;['wheel','touchstart','keydown','mousedown'].forEach(function(n){addEventListener(n,function(){u=true},{passive:true,once:true})});function t(){if(u||location.hash)return;var d=document.documentElement,b=d.style.scrollBehavior;d.style.scrollBehavior='auto';window.scrollTo(0,0);d.style.scrollBehavior=b}t();addEventListener('DOMContentLoaded',t);addEventListener('load',t);addEventListener('pageshow',t);[120,400,900].forEach(function(m){setTimeout(t,m)})})()`
const FONTS = [['Inter', 'inter'], ['Geist Mono', 'geist-mono']].flatMap(([n, f]) => [face(n, `${f}-latin-wght-normal`, LATIN), face(n, `${f}-latin-ext-wght-normal`, EXT)]).join('')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <style dangerouslySetInnerHTML={{ __html: FONTS }} />
        {process.env.NEXT_PUBLIC_FLAT === '1' && <script dangerouslySetInnerHTML={{ __html: TOP }} />}
      </head>
      <body>{children}<StackFx /></body>
    </html>
  )
}
