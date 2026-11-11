// Makes the 1200x630 sharing cards in public/og, one per page, from each page's own headline and gradient.
// Run it after a headline changes:  npm run dev   then   node scripts/og.cjs http://localhost:3000
// It needs Playwright (npx playwright install chromium). It is a maintenance tool, not part of the build.
const { chromium } = require('playwright')
const { readFileSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')

const root = join(__dirname, '..')
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const font = readFileSync(join(root, 'public/fonts/inter-latin-wght-normal.woff2')).toString('base64')
const logo = readFileSync(join(root, 'public/brand/taxstreem-logo-white.svg'), 'utf8')
const GRAD = {
  base: 'radial-gradient(120% 120% at 92% 104%, #bfe2ff 0%, #bfe2ff00 40%), linear-gradient(118deg, #07111f 0%, #0a2a57 30%, #0f5bd8 62%, #2e8bff 84%, #7cc0ff 100%)',
  flat: 'radial-gradient(130% 130% at 94% 108%, #9ed0ff 0%, #9ed0ff00 44%), linear-gradient(125deg, #07101d 0%, #0b2c5a 34%, #0f5bd8 68%, #54a4ff 100%)',
  violet: 'radial-gradient(90% 80% at 86% 8%, #7856f28c 0%, #7856f200 50%), radial-gradient(120% 120% at 94% 104%, #bfe2ff 0%, #bfe2ff00 42%), linear-gradient(120deg, #0a1130 0%, #122a6b 26%, #1b5be6 58%, #4a63f0 82%, #93b4ff 100%)',
  azure: 'radial-gradient(100% 90% at 84% 6%, #5ac8ff59 0%, #5ac8ff00 52%), radial-gradient(120% 120% at 92% 106%, #cfebff 0%, #cfebff00 44%), linear-gradient(122deg, #06121f 0%, #0a357e 32%, #0f6ae0 66%, #45a6ff 100%)',
  deep: 'radial-gradient(80% 70% at 88% 10%, #6376ff57 0%, #6376ff00 54%), radial-gradient(120% 130% at 86% 108%, #6faeff 0%, #6faeff00 44%), linear-gradient(124deg, #050b18 0%, #0a1e47 38%, #123e9c 70%, #2e72e6 100%)',
  aurora: 'radial-gradient(80% 80% at 12% 6%, #6e56f273 0%, #6e56f200 50%), radial-gradient(90% 90% at 96% 96%, #3e88ff99 0%, #3e88ff00 48%), linear-gradient(120deg, #0a1030 0%, #15246a 30%, #1c56de 62%, #5e7bf2 100%)',
}
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const card = (h1, g) => `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Inter;font-weight:100 900;src:url(data:font/woff2;base64,${font}) format('woff2')}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:Inter,sans-serif;color:#fff;background:${GRAD[g] || GRAD.base};position:relative;-webkit-font-smoothing:antialiased}
.rules{position:absolute;inset:0;display:flex;justify-content:space-between;padding:0 72px;-webkit-mask-image:linear-gradient(#000,transparent 80%)}
.rules i{width:1px;background:rgba(255,255,255,.07)}
svg.flow{position:absolute;left:0;bottom:0;width:100%;height:60%;opacity:.3}
.in{position:absolute;inset:64px 72px 60px;display:flex;flex-direction:column}
.logo svg{height:40px;width:auto;display:block}
h1{font-weight:700;letter-spacing:-.04em;line-height:1.03;max-width:980px;margin-top:auto;text-wrap:balance}
.foot{margin-top:34px;display:flex;align-items:center;gap:16px;font-size:25px;font-weight:500;color:rgba(255,255,255,.86)}
.foot b{font-weight:600;color:#fff}.foot i{width:28px;height:1px;background:rgba(255,255,255,.6)}
</style><body><div class="rules">${'<i></i>'.repeat(9)}</div>
<div class="in"><div class="logo">${logo}</div><h1 id="h">${esc(h1)}</h1><div class="foot"><b>taxstreem.com</b><i></i><span>Accounting and tax software for Nigeria</span></div></div>
<script>(function(){var h=document.getElementById('h'),s=86;h.style.fontSize=s+'px';while(h.offsetHeight>300&&s>44){s-=2;h.style.fontSize=s+'px'}})()</script></body>`

;(async () => {
const slug = (p) => (p === '/' ? 'home' : p.slice(1).replace(/\//g, '-'))
const xml = await (await fetch(base + '/sitemap.xml')).text()
const paths = [...new Set([...xml.matchAll(/<loc>https:\/\/www\.taxstreem\.com([^<]*)<\/loc>/g)].map((m) => m[1] || '/'))].filter((p) => !p.startsWith('/resources/articles/'))
mkdirSync(join(root, 'public/og'), { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
let made = 0
for (const p of paths) {
  const res = await fetch(base + p)
  if (res.status !== 200) { console.log('skipped (not served here):', p); continue }
  const html = await res.text()
  const hero = html.match(/<section class="(?:hero|pg-hero) gs[^"]*"[^>]*data-g="([a-z]+)"/)
  if (!hero) { console.log('skipped (served elsewhere):', p); continue }
  const h1 = p === '/' ? 'Tax Compliance Finally on Autopilot' : (html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1] || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim()
  await page.setContent(card(h1, hero[1]), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(root, 'public/og', slug(p) + '.jpg'), type: 'jpeg', quality: 84 })
  made++
}
await browser.close()
console.log(made, 'cards written to public/og')
})()
