/** @type {import('next').NextConfig} */
const preview = process.env.PREVIEW === '1'
export default {
  output: preview ? 'export' : 'standalone',
  assetPrefix: preview ? '.' : undefined,
  images: { unoptimized: true },
  trailingSlash: preview && process.env.NEXT_PUBLIC_FLAT !== '1',
  typescript: { ignoreBuildErrors: false },
}
