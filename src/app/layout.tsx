import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.taxstreem.com'),
  title: 'TaxStreem: bookkeeping and tax filing software for Nigerian businesses',
  description: 'Keep your books, recover input VAT and file VAT, WHT, CIT and PIT returns with the NRS and State Internal Revenue Services from one place.',
  openGraph: { title: 'TaxStreem', description: 'Tax compliance, finally on autopilot.', type: 'website', locale: 'en_NG', siteName: 'TaxStreem' },
  icons: { icon: (process.env.NEXT_PUBLIC_BASE ?? '') + '/brand/taxstreem-icon-blue.svg' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff' }

const B = process.env.NEXT_PUBLIC_BASE ?? ''
const face = (family: string, file: string, range: string) => `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:100 900;src:url(${B}/fonts/${file}.woff2) format('woff2-variations');unicode-range:${range}}`
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
const EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
const FONTS = [['Hanken Grotesk', 'hanken-grotesk'], ['Schibsted Grotesk', 'schibsted-grotesk'], ['Geist Mono', 'geist-mono']].flatMap(([n, f]) => [face(n, `${f}-latin-wght-normal`, LATIN), face(n, `${f}-latin-ext-wght-normal`, EXT)]).join('')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="preload" href={`${B}/fonts/schibsted-grotesk-latin-wght-normal.woff2`} as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href={`${B}/fonts/hanken-grotesk-latin-wght-normal.woff2`} as="font" type="font/woff2" crossOrigin="" />
        <style dangerouslySetInnerHTML={{ __html: FONTS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
