import { Camera } from 'lucide-react'
import { asset } from '../lib/asset'

/** A photo slot. Until `src` is set it shows the brief for the picture that belongs there. */
export function Photo({ n, brief, ratio = '4 / 3', src, alt = '', className = '' }: { n: number; brief: string; ratio?: string; src?: string; alt?: string; className?: string }) {
  return (
    <figure className={`photo ${className}`} style={{ aspectRatio: ratio }} data-empty={!src || undefined}>
      {src ? <img src={asset(src)} alt={alt} loading="lazy" /> : (
        <figcaption><Camera size={18} /><b>Photo {n}</b><span>{brief}</span></figcaption>
      )}
    </figure>
  )
}
