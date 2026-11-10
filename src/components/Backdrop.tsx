/** Animated grounds: drifting colour, ruled lines with travelling light, flowing curves. Pure CSS and SVG. */
export function Aurora({ tone = 'light' }: { tone?: 'light' | 'dark' | 'blue' }) {
  return (
    <div className="bg" data-tone={tone} aria-hidden>
      <i className="blob b1" /><i className="blob b2" /><i className="blob b3" />
      <div className="rules">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}</div>
      <Flow />
    </div>
  )
}

export function Flow() {
  const paths = [
    'M-50 420 C 250 300, 420 520, 720 380 S 1180 180, 1500 300',
    'M-50 500 C 300 420, 480 600, 760 470 S 1200 280, 1500 400',
    'M-50 330 C 220 200, 460 420, 700 280 S 1160 90, 1500 190',
    'M-50 580 C 320 520, 520 660, 800 560 S 1220 400, 1500 500',
  ]
  return (
    <svg className="flow" viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="flowg" x1="0" x2="1"><stop offset="0" stopColor="currentColor" stopOpacity="0" /><stop offset=".5" stopColor="currentColor" stopOpacity="1" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} className="flow-base" />
          <path d={d} className="flow-run" style={{ animationDelay: `${i * -2.3}s`, animationDuration: `${9 + i * 2}s` }} pathLength={1000} />
        </g>
      ))}
    </svg>
  )
}

export function Grain() {
  return <div className="grain" aria-hidden />
}
