// In the preview these open the live site. On the live site they are ordinary pages at the same address.
const SITE = process.env.NEXT_PUBLIC_FLAT === '1' ? 'https://www.taxstreem.com' : ''
export const LINKS = {
  start: `${SITE}/get-invite`,
  login: 'https://app.taxstreem.com',
  dev: 'https://developer-portal.taxstreem.com/',
  privacy: `${SITE}/privacy`,
  terms: `${SITE}/terms`,
}

export type NavLink = { label: string; line: string; href: string; icon?: string; tag?: string; external?: boolean }
export type NavGroup = { heading?: string; links: NavLink[] }
export type NavItem = { label: string; href?: string; groups?: NavGroup[]; intro?: string; card?: { title: string; line: string; cta: string; href: string } }

export const NAV: NavItem[] = [
  {
    label: 'Products',
    intro: 'Pick the one that matches how you earn.',
    groups: [
      {
        links: [
          { label: 'TaxStreem for Service Businesses', line: 'Agencies, firms, consultancies, schools, tech companies. Invoices, books and taxes in one place.', href: '/service-businesses', icon: 'briefcase' },
          { label: 'Countev', line: 'Shops, pharmacies, restaurants, manufacturers and distributors. Inventory, sales, books and taxes.', href: '/countev', icon: 'store' },
          { label: 'TaxStreem for Personal Income Tax', line: 'Freelancers, creators, contractors and salary earners with side income. File your annual return.', href: '/personal-income-tax', icon: 'user' },
          { label: 'TaxStreem for Tax Professionals', line: 'Accountants, lawyers and tax consultants. Every client in one portal, free.', href: '/tax-professionals', icon: 'scale' },
          { label: 'Martina', line: 'The assistant inside every product. She chats on WhatsApp, makes calls and explains your numbers.', href: '/martina', icon: 'martina' },
        ],
      },
    ],
    card: { title: 'Not sure which fits?', line: 'Answer three questions and we point you to the right one.', cta: 'Find my product', href: '/find-my-product' },
  },
  {
    label: 'Solutions',
    groups: [
      {
        heading: 'What you get',
        links: [
          { label: 'Recover your input VAT', line: 'Every VAT naira you paid suppliers, matched and claimed.', href: '/solutions/input-vat-recovery' },
          { label: 'Track refunds and credits', line: 'WHT credit notes and excess VAT, so you know what you are owed.', href: '/solutions/tax-refunds' },
          { label: 'Books lenders and investors accept', line: 'IFRS financial statements, ready the day they ask.', href: '/solutions/clean-books' },
          { label: 'File VAT, WHT, CIT and PIT on time', line: 'Returns prepared from your books and filed on the tax portal.', href: '/solutions/tax-filing' },
          { label: 'Less manual work for finance teams', line: 'Payables, receivables, inventory and month-end close, with the routine steps done for you.', href: '/solutions/finance-teams' },
          { label: 'Reconcile payments, books and stock', line: 'Bank, POS, wallet and inventory checked against each other daily.', href: '/solutions/reconciliation' },
        ],
      },
      {
        heading: 'Built in',
        links: [
          { label: 'E-invoicing', line: 'Invoices validated by the NRS.', href: '/e-invoicing', tag: 'Licensing in progress' },
          { label: 'Integrations', line: 'Banks, payment providers, POS terminals, accounting software and tax portals.', href: '/integrations' },
          { label: 'Embedded infrastructure', line: 'For fintechs, banks and platforms that want tax inside their product.', href: '/embedded-infrastructure' },
          { label: 'Industries', line: 'How TaxStreem fits retail, services, manufacturing, hospitality and more.', href: '/industries' },
        ],
      },
    ],
  },
  {
    label: 'Developers',
    groups: [
      {
        links: [
          { label: 'API Documentation', line: 'Guides for tax computation, e-invoicing, accounting, inventory and filing.', href: LINKS.dev, external: true },
          { label: 'Quickstart', line: 'Your first API call in the sandbox.', href: LINKS.dev, external: true },
          { label: 'API Reference', line: 'Every endpoint, request and response.', href: LINKS.dev, external: true },
        ],
      },
    ],
  },
  {
    label: 'Security',
    groups: [
      {
        links: [
          { label: 'Trust Centre', line: 'How your data is stored, encrypted and accessed.', href: '/security' },
          { label: 'Certifications', line: 'NDPA and GDPR compliance. ISO 27001:2022 in progress.', href: '/security#certifications' },
          { label: 'Responsible Disclosure', line: 'Report a vulnerability to our security team.', href: '/security#disclosure' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    groups: [
      {
        links: [
          { label: 'All Resources', line: 'Everything we have published.', href: '/resources' },
          { label: 'Articles', line: 'Nigerian tax explained in plain English: VAT, WHT, CIT, PIT.', href: '/resources#articles' },
          { label: 'Videos', line: 'Short explainers and walkthroughs.', href: '/resources#videos' },
          { label: 'Demos', line: 'Watch each product do a real task.', href: '/resources#demos' },
        ],
      },
      {
        links: [
          { label: 'Reports & Analysis', line: 'Research on tax and business in Nigeria.', href: '/resources#reports' },
          { label: 'Guides', line: 'Step-by-step guides, the tax calendar and the tax glossary.', href: '/resources/glossary' },
          { label: 'The Bridge', line: 'Our weekly open office. Bring a tax question, leave with an answer.', href: 'https://www.taxstreem.com/the-bridge', external: true },
          { label: 'Newsroom', line: 'Press coverage and announcements.', href: '/newsroom' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    groups: [
      {
        links: [
          { label: 'About Us', line: 'Who we are and why we started in Nigeria.', href: '/about' },
          { label: 'Newsroom', line: 'Coverage and announcements.', href: '/newsroom' },
          { label: 'Careers', line: 'Build the tax infrastructure for a continent.', href: '/careers' },
          { label: 'Partners', line: 'The referral programme and technology partners.', href: '/partners' },
          { label: 'Contact Us', line: 'Sales, support and press.', href: '/contact' },
        ],
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
]

export const RESULTS = [
  { key: 'vat', title: 'Recover your input VAT', copy: 'Most businesses pay VAT to suppliers and never claim it back. TaxStreem reads each supplier invoice, records the VAT, and sets it against the VAT you charge once the invoice is paid.', href: '/solutions/input-vat-recovery' },
  { key: 'owed', title: 'Know what you are owed', copy: 'Customers deduct Withholding Tax (WHT) when they pay you. TaxStreem records every deduction and its credit note, and tracks excess VAT, so you always know what you are owed.', href: '/solutions/tax-refunds' },
  { key: 'books', title: 'Books that get you funded', copy: 'Banks and investors ask for financial statements. Yours are prepared to IFRS from live data: profit and loss, balance sheet and cash flow, any day you need them.', href: '/solutions/clean-books' },
  { key: 'file', title: 'Every return filed on time', copy: 'VAT and WHT monthly. Companies Income Tax (CIT) and Personal Income Tax (PIT) yearly. TaxStreem prepares each return from your books and files it on the tax portal, including portals with no API.', href: '/solutions/tax-filing' },
  { key: 'team', title: 'Hours back for your finance team', copy: 'Supplier bills are read and checked. Payments are matched. Stock is received from the invoice. Month-end close becomes a review.', href: '/solutions/finance-teams' },
  { key: 'recon', title: 'One set of numbers', copy: 'Bank, POS, wallet, stock and ledger are reconciled against each other every day. When something does not match, you see it that day.', href: '/solutions/reconciliation' },
]

export const PRODUCTS = [
  { name: 'TaxStreem for Service Businesses', who: 'Firms, agencies, consultancies, schools, clinics, tech companies', what: 'Invoicing, supplier bills, payments, books, VAT, WHT and CIT', cta: 'See Service Businesses', href: '/service-businesses' },
  { name: 'Countev', who: 'Retail, restaurants, pharmacies, manufacturing, distribution, any business with stock or walk-in customers', what: 'Everything above, plus inventory run by AI agents, a till, POS terminals and branches', cta: 'See Countev', href: '/countev' },
  { name: 'TaxStreem for Personal Income Tax', who: 'Freelancers, creators, contractors, professionals', what: 'Works out your tax and files your annual return with your state tax authority', cta: 'See Personal Income Tax', href: '/personal-income-tax' },
  { name: 'TaxStreem for Tax Professionals', who: 'Accountants, lawyers, finance professionals, tax consultants', what: 'A free portal for every client’s books, returns and documents, and a share of what your clients pay', cta: 'See Tax Professionals', href: '/tax-professionals' },
]

export const STEPS = [
  { title: 'Connect.', copy: 'Link your bank accounts, payment provider and POS, or upload statements. Import from QuickBooks, Xero or Zoho Books if you use them.' },
  { title: 'Review.', copy: 'TaxStreem records each transaction, reads each invoice and asks you only about the ones it is unsure of.' },
  { title: 'File.', copy: 'Your returns are prepared from the books. Approve them and TaxStreem files with the NRS or your state tax authority, then keeps the receipt.' },
]

export const FAQ = [
  ['What is TaxStreem?', 'TaxStreem is tax and accounting software for businesses and individuals in Nigeria. It keeps your books, issues your invoices, manages your inventory, and prepares and files your VAT, WHT, CIT and PIT returns.'],
  ['Which taxes does TaxStreem file?', 'Value Added Tax (VAT), Withholding Tax (WHT), Companies Income Tax (CIT) and Personal Income Tax (PIT). VAT, WHT and CIT are filed with the Nigeria Revenue Service. PIT is filed with the Lagos State Internal Revenue Service (LIRS).'],
  ['How does TaxStreem help me recover input VAT?', 'It reads the VAT on each supplier invoice, checks the supplier’s Tax ID, and claims the VAT in the month the invoice is paid. The VAT return shows every invoice behind the figure.'],
  ['Can TaxStreem file where the tax portal has no API?', 'Yes. TaxStreem’s filing agent completes the return on the portal, submits it and saves the acknowledgement.'],
  ['Do I need an accountant to use it?', 'No. If you have one, invite them. They work on your books from their own portal, at no cost to them.'],
  ['Is TaxStreem only for Nigeria?', 'TaxStreem is built for African businesses and is live in Nigeria today. More countries will follow.'],
  ['How much does it cost?', 'Starter is ₦30,000 a month and Growth is ₦75,000 a month, with 15% off when you pay for a year. Personal Income Tax is ₦50,000 a year. Enterprise pricing is agreed with you.'],
] as const

export const PARTNER_LOGOS = [
  ['mono', 'Mono'], ['paystack', 'Paystack'], ['flutterwave', 'Flutterwave'], ['moniepoint', 'Moniepoint'], ['bujeti', 'Bujeti'],
  ['quickbooks', 'QuickBooks'], ['xero', 'Xero'], ['zoho-books', 'Zoho Books'], ['nrs', 'Nigeria Revenue Service'], ['lirs', 'Lagos State Internal Revenue Service'],
  ['cac', 'Corporate Affairs Commission'], ['whatsapp', 'WhatsApp'],
] as const
