'use client'
import { useState } from 'react'

/** A founder's bio: the first paragraph, then the rest behind a Read more / Read less switch. */
export function Bio({ paras, id }: { paras: readonly string[]; id: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <p>{paras[0]}</p>
      {paras.length > 1 && <>
        <div id={id} hidden={!open} className="bio-rest">{paras.slice(1).map((t, i) => <p key={i}>{t}</p>)}</div>
        <button type="button" className="bio-more" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Read less' : 'Read more'}</button>
      </>}
    </>
  )
}
