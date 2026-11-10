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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body>{children}</body>
    </html>
  )
}
