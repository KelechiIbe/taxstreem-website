/** @type {import('next').NextConfig} */
const preview = process.env.PREVIEW === '1'
export default {
  output: preview ? 'export' : 'standalone',
  assetPrefix: preview ? '.' : undefined,
  images: { unoptimized: true },
  trailingSlash: preview,
  typescript: { ignoreBuildErrors: false },
}
