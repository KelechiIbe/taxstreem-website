const BASE = process.env.NEXT_PUBLIC_BASE ?? ''
export const asset = (p: string) => `${BASE}${p}`
