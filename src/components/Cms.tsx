import { ArrowRight, ArrowUpRight, Play, CalendarDays } from 'lucide-react'
import { articles, videos, newsroom, events, pic, day, label, mins, type Article } from '../lib/cms'
import { asset, link } from '../lib/asset'
import { Reveal } from './Reveal'
import { Aurora } from './Backdrop'

const PRESS: Record<string, string> = { punch: 'punch', thisday: 'thisday', vanguard: 'vanguard', nairametrics: 'nairametrics', 'the guardian': 'guardian', businessday: 'businessday', techcabal: 'techcabal', forbes: 'forbes' }

export function ArticleCard({ a, big, i = 0 }: { a: Article; big?: boolean; i?: number }) {
  return (
    <Reveal as="li" delay={Math.min(i, 3) * 70} style={{ ['--i' as string]: i }} className={big ? 'rcard rcard-big' : 'rcard'}>
      <a href={link(`/resources/articles/${a.slug}`)}>
        <span className="rcard-img"><img src={pic(a.coverImage)} alt="" loading="lazy" /></span>
        <span className="rcard-txt">
          <span className="rcard-meta"><b>{label(a.category)}</b><i>{a.readTime}</i></span>
          <h3>{a.title}</h3>
          <p>{a.excerpt}</p>
          <span className="rcard-by">{a.author?.fullName ? `${a.author.fullName} · ` : ''}{day(a.publishedAt)}<ArrowRight size={16} /></span>
        </span>
      </a>
    </Reveal>
  )
}

/** Resources: articles, videos and The Bridge, read from the CMS. */
export async function ResourcesBody({ bridgeLine }: { bridgeLine: string }) {
  const [arts, vids, evs] = await Promise.all([articles(), videos(), events()])
  const lead = arts.find((a) => a.featured) ?? arts[0]
  const rest = arts.filter((a) => a !== lead)
  const now = new Date().toISOString()
  const next = [...evs].reverse().find((e) => e.date > now)
  const past = evs.filter((e) => e.date <= now).slice(0, 4)
  return (
    <>
      <section className="chap" id="articles"><div className="wrap">
        <nav className="rtabs" aria-label="Resources">
          <a href="#articles">Articles <i>{arts.length}</i></a>{vids.length > 0 && <a href="#videos">Videos <i>{vids.length}</i></a>}<a href="#the-bridge">The Bridge</a><a href={link('/resources/glossary')}>Tax glossary</a>
        </nav>
        {!arts.length ? <p className="ptext">New articles appear here as soon as they are published.</p> : (
          <>
            <ul className="rgrid rgrid-lead">{lead && <ArticleCard a={lead} big />}</ul>
            <ul className="rgrid">{rest.map((a, i) => <ArticleCard key={a.id} a={a} i={i} />)}</ul>
          </>
        )}
      </div></section>

      {vids.length > 0 && (
        <section className="chap" id="videos"><div className="wrap">
          <div className="pg-h" style={{ marginTop: 0 }}><h2>Videos</h2></div>
          <ul className="vgrid">
            {vids.map((v, i) => (
              <Reveal as="li" key={v.id} delay={i * 70}>
                <a href={v.videoUrl} target="_blank" rel="noopener">
                  <span className="vthumb">{v.thumbnail && <img src={pic(v.thumbnail)} alt="" loading="lazy" />}<i><Play size={22} fill="currentColor" /></i><em>{mins(v.durationSeconds)}</em></span>
                  <span className="rcard-meta"><b>{label(v.category)}</b><i>{day(v.publishedAt)}</i></span>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                </a>
              </Reveal>
            ))}
          </ul>
        </div></section>
      )}

      <section className="chap sec-dark" id="the-bridge" data-split><Aurora tone="dark" /><div className="wrap chap-in">
        <div className="chap-rail"><Reveal kind="blur"><h2>The Bridge</h2></Reveal><p className="bridge-line">{bridgeLine}</p></div>
        <div className="chap-body">
          <div className="bridge-next"><CalendarDays size={20} />{next ? <span><b>{next.title}</b><i>{day(next.date)} · {next.venueType === 'VIRTUAL' ? 'Online' : 'In person'} · {next.spotsRemaining} places left</i></span> : <span><b>The next session has not been announced.</b><i>New dates appear here the moment they are set.</i></span>}</div>
          {past.length > 0 && <ul className="bridge-past">{past.map((e) => <li key={e.id}><b>{day(e.date)}</b><span>{e.description}</span></li>)}</ul>}
        </div>
      </div></section>
    </>
  )
}

/** Newsroom: press coverage, each item opening on the publisher's site. */
export async function NewsroomBody() {
  const items = await newsroom()
  if (!items.length) return <section className="chap"><div className="wrap"><p className="ptext">Press coverage appears here as it is published.</p></div></section>
  return (
    <section className="chap"><div className="wrap">
      <ul className="ngrid">
        {items.map((n, i) => {
          const pub = n.publication.trim(); const logo = PRESS[pub.toLowerCase()]
          return (
            <Reveal as="li" key={n.id} delay={Math.min(i % 3, 2) * 70} style={{ ['--i' as string]: Math.min(i, 7) }}>
              <a href={n.externalUrl} target="_blank" rel="noopener">
                <span className="nthumb"><b aria-hidden>{logo ? <img src={asset(`/press/${logo}.png`)} alt="" /> : pub}</b>{n.thumbnail && <img className="nthumb-pic" src={pic(n.thumbnail)} alt="" loading="lazy" referrerPolicy="no-referrer" />}</span>
                <span className="npub">{logo ? <img src={asset(`/press/${logo}.png`)} alt={pub} /> : <b>{pub}</b>}<i>{label(n.category)}</i></span>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
                <span className="rcard-by">Read on {pub}<ArrowUpRight size={16} /></span>
              </a>
            </Reveal>
          )
        })}
      </ul>
    </div></section>
  )
}
