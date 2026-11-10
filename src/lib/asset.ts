const BASE = process.env.NEXT_PUBLIC_BASE ?? ''
const FLAT = process.env.NEXT_PUBLIC_FLAT === '1'
export const asset = (p: string) => `${BASE}${p}`
/** Internal link. In the flat preview build every page sits beside index.html. */
export const link = (p: string) => {
  if (!FLAT || !p.startsWith('/')) return p
  const [path, hash] = p.split('#')
  const file = path === '/' ? 'index' : path.slice(1).replace(/\//g, '-')
  return `./${file}.html${hash ? '#' + hash : ''}`
}
