import { SOCIAL } from '../content/site'

const ICON: Record<string, React.ReactNode> = {
  LinkedIn: <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />,
  X: <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  YouTube: <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" /></>,
}

/** The company's four profiles, as round icon links. Each opens in a new tab. */
export function Social() {
  return (
    <ul className="ftr-soc" aria-label="TaxStreem on social media">
      {SOCIAL.map(([name, href]) => (
        <li key={name}>
          <a href={href} target="_blank" rel="noopener" aria-label={`TaxStreem on ${name} (opens in a new tab)`}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>{ICON[name]}</svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
