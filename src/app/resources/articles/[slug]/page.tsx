import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Info } from 'lucide-react'
import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Grain } from '../../../../components/Backdrop'
import { Reveal } from '../../../../components/Reveal'
import { Newsletter } from '../../../../components/Newsletter'
import { ArticleCard } from '../../../../components/Cms'
import { ReadBar } from '../../../../components/ReadBar'
import { articles, article, pic, day, label, clean, plain, type BodyBlock } from '../../../../lib/cms'
import { link } from '../../../../lib/asset'

// The preview is a fixed set of files; the live site also serves articles published after the last build.
export const dynamicParams = process.env.PREVIEW !== '1'
export const revalidate = 300
export async function generateStaticParams() { return (await articles()).map((a) => ({ slug: a.slug })) }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { article: a } = await article(params.slug)
  if (!a) return { title: 'Article not found | TaxStreem' }
  return { title: `${a.title} | TaxStreem`, description: a.excerpt, alternates: { canonical: `/resources/articles/${a.slug}` }, openGraph: { title: a.title, description: a.excerpt, type: 'article', url: `/resources/articles/${a.slug}`, siteName: 'TaxStreem', locale: 'en_NG', images: a.coverImage ? [a.coverImage] : ['/og/resources.jpg'], publishedTime: a.publishedAt, modifiedTime: a.updatedAt }, twitter: { card: 'summary_large_image', site: '@taxstreem', title: a.title, description: a.excerpt, images: a.coverImage ? [a.coverImage] : ['/og/resources.jpg'] } }
}

const H = ({ html }: { html: string }) => <span dangerouslySetInnerHTML={{ __html: clean(html) }} />

function Body({ blocks }: { blocks: BodyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading': return <h2 key={b.id} id={`s-${i}`}>{plain(b.text ?? '')}</h2>
          case 'subheading': return <h3 key={b.id}>{plain(b.text ?? '')}</h3>
          case 'paragraph': return b.text?.trim() ? <p key={b.id}><H html={b.text} /></p> : null
          case 'bulletlist': return <ul key={b.id}>{(b.items ?? []).map((t, j) => <li key={j}><H html={t} /></li>)}</ul>
          case 'numberedlist': return <ol key={b.id}>{(b.items ?? []).map((t, j) => <li key={j}><H html={t} /></li>)}</ol>
          case 'pullquote': return <blockquote key={b.id}><p><H html={b.text ?? ''} /></p>{b.attribution?.trim() && <cite>{b.attribution}</cite>}</blockquote>
          case 'callout': return <aside key={b.id} className="art-note"><Info size={18} /><div>{b.title && <p><H html={b.title} /></p>}{b.body?.trim() && <p><H html={b.body} /></p>}</div></aside>
          case 'image': return b.url ? <figure key={b.id}><img src={pic(b.url)} alt={b.caption ?? ''} loading="lazy" />{b.caption?.trim() && <figcaption>{b.caption}</figcaption>}</figure> : null
          case 'table': return (
            <div key={b.id} className="art-table"><table>
              {b.headers?.some((h) => h.trim()) && <thead><tr>{b.headers.map((h, j) => <th key={j} scope="col"><H html={h} /></th>)}</tr></thead>}
              <tbody>{(b.rows ?? []).map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k} data-h={plain(b.headers?.[k] ?? '')}><H html={c} /></td>)}</tr>)}</tbody>
            </table></div>
          )
          default: return null
        }
      })}
    </>
  )
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { article: a, related } = await article(params.slug)
  if (!a) notFound()
  const toc = a.body.map((b, i) => ({ b, i })).filter(({ b }) => b.type === 'heading' && plain(b.text ?? ''))
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, image: a.coverImage || undefined, datePublished: a.publishedAt, dateModified: a.updatedAt, author: a.author?.fullName ? { '@type': 'Person', name: a.author.fullName } : undefined, publisher: { '@type': 'Organization', '@id': 'https://www.taxstreem.com/#organization', name: 'TaxStreem', url: 'https://www.taxstreem.com', logo: { '@type': 'ImageObject', url: 'https://www.taxstreem.com/brand/taxstreem-logo-blue.svg' } }, inLanguage: 'en-NG', mainEntityOfPage: `https://www.taxstreem.com/resources/articles/${a.slug}` }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Grain />
      <Header />
      <ReadBar />
      <main className="pg art">
        <header className="art-hero"><div className="wrap">
          <a className="art-back" href={link('/resources')}><ArrowLeft size={15} /> Resources</a>
          <p className="rcard-meta rise"><b>{label(a.category)}</b><i>{a.readTime}</i></p>
          <h1 className="rise" style={{ ['--d' as string]: '80ms' }}>{a.title}</h1>
          <p className="lede rise" style={{ ['--d' as string]: '160ms' }}>{a.excerpt}</p>
          <p className="art-by rise" style={{ ['--d' as string]: '220ms' }}>{a.author?.fullName && <><i aria-hidden>{a.author.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('')}</i><b>{a.author.fullName}</b></>}<span>{day(a.publishedAt)}</span></p>
        </div></header>
        {a.coverImage && <div className="wrap"><Reveal kind="wipe" className="art-cover"><img src={pic(a.coverImage)} alt={a.coverCaption ?? ''} /></Reveal></div>}
        <div className="wrap art-grid">
          {toc.length > 2 && <nav className="art-toc" aria-label="In this article"><b>In this article</b><ol>{toc.map(({ b, i }) => <li key={b.id}><a href={`#s-${i}`}>{plain(b.text ?? '').replace(/^\d+\.\s*/, '')}</a></li>)}</ol></nav>}
          <article className="art-body">
            <Body blocks={a.body} />
            {a.author?.authorBio && <footer className="art-author"><b>About {a.author.fullName}</b><p>{a.author.authorBio}</p></footer>}
          </article>
        </div>
        {related.length > 0 && <section className="chap"><div className="wrap"><div className="pg-h" style={{ marginTop: 0 }}><h2>Keep reading</h2></div><ul className="rgrid">{related.map((r, i) => <ArticleCard key={r.id} a={r} i={i} />)}</ul></div></section>}
        <section className="chap" style={{ paddingTop: 0 }}><div className="wrap"><div className="news-band" style={{ marginTop: 0 }}><i className="mesh" aria-hidden /><i className="gridlines" aria-hidden /><Newsletter id="news-article" big /></div></div></section>
      </main>
      <Footer />
    </>
  )
}
