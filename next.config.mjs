/** @type {import('next').NextConfig} */
const preview = process.env.PREVIEW === '1'
// The site this one replaces. Pages the new site does not have yet (sign-up, privacy, terms, The Bridge) are still
// served from it, under the same addresses, so no existing link breaks. Leave unset once those pages are rebuilt here.
const legacy = (process.env.LEGACY_SITE_URL || '').replace(/\/$/, '')
const LEGACY_PAGES = ['/get-invite', '/privacy', '/terms', '/the-bridge', '/the-bridge/:path*', '/get-on-rev360', '/demo']
// Old addresses that now have a new home.
const MOVED = [
  ['/products', '/find-my-product'], ['/who-its-for', '/industries'], ['/developers', '/embedded-infrastructure'],
  ['/numens', '/modules'], ['/prism', '/modules'], ['/atlas', '/modules'], ['/flux', '/modules'], ['/aero', '/modules'],
  ['/resources/articles', '/resources#articles'], ['/resources/videos', '/resources#videos'], ['/resources/guides', '/resources/glossary'],
  ['/resources/reports', '/resources'], ['/resources/demos', '/resources'],
]
const config = {
  output: preview ? 'export' : 'standalone',
  assetPrefix: preview ? '.' : undefined,
  images: { unoptimized: true },
  trailingSlash: preview && process.env.NEXT_PUBLIC_FLAT !== '1',
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
}
if (!preview) {
  // On a bare Cloud Run address the site is a rehearsal copy: keep search engines away from it.
  config.headers = async () => [
    { source: '/:path*', has: [{ type: 'host', value: '.*\\.run\\.app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ]
  config.redirects = async () => MOVED.map(([source, destination]) => ({ source, destination, permanent: true }))
  config.rewrites = async () => ({
    beforeFiles: legacy ? [{ source: '/_next/image', destination: `${legacy}/_next/image` }] : [],
    afterFiles: legacy ? LEGACY_PAGES.map((source) => ({ source, destination: `${legacy}${source}` })) : [],
    // The old pages ask for their own scripts, styles and pictures; anything this site does not have is fetched from the old one.
    fallback: legacy ? [{ source: '/:path*', destination: `${legacy}/:path*` }] : [],
  })
}
export default config
