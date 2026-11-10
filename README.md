# TaxStreem website

The public website for www.taxstreem.com: Next.js 14 (app router), run as a small Node server on Cloud Run.

## Deploy

1. Open `.env.production` and set `LEGACY_SITE_URL` to the Cloud Run address of the **current** website
   (Cloud Run console, the existing website service, the URL at the top; it ends in `.run.app`).
2. Run:

   ```sh
   sh deploy.sh
   ```

   It builds the container with Cloud Build and deploys the `taxstreem-website` service in `us-central1`.
   Other project, service name or region: `PROJECT=… SERVICE=… REGION=… sh deploy.sh`.
3. Open the new service's `.run.app` address and check it.
4. Move the `www.taxstreem.com` (and `taxstreem.com`) domain mapping from the old service to the new one.
   Keep the old service running: the new site still serves four of its pages (see below).

## Settings (`.env.production`, read at build time, no secrets)

| Name | What it is |
| --- | --- |
| `LEGACY_SITE_URL` | The old website's `.run.app` address. Never the public domain, or requests would loop. |
| `CMS_URL` | The CMS the Resources, Newsroom and article pages read from. |
| `NEXT_PUBLIC_API_URL` | The API the newsletter and contact forms post to (`/newsletter/subscribe`, `/contact/submit`). |

## What still comes from the old website

`/get-invite`, `/privacy`, `/terms`, `/the-bridge`, `/get-on-rev360` and `/demo` are not rebuilt here yet.
The server passes those addresses, and any script, style or picture they ask for, through to `LEGACY_SITE_URL`
(see `next.config.mjs`). Visitors stay on www.taxstreem.com throughout. Old addresses that have a new home
(`/products`, `/numens`, `/resources/articles` and so on) answer with a permanent redirect.

When those pages are rebuilt in this project, empty `LEGACY_SITE_URL` and the old service can be switched off.

## Content from the CMS

Resources, Newsroom, each article and the sitemap are read from the CMS on the server and refreshed every five
minutes. A newly published article gets its page without a redeploy. If the CMS cannot be reached the pages still
load, with those sections empty. Routes and fields are noted in `cms-notes.md`.

## Forms

The newsletter and contact forms post from the visitor's browser straight to `NEXT_PUBLIC_API_URL`.
That API must allow the address the site is served from. It already allows www.taxstreem.com; a temporary
`.run.app` address may be refused until it is added there or the domain is moved.

## Working on it

```sh
npm ci
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # the same build the container runs
```

- `src/app/page.tsx` is the home page; `src/app/[...slug]/page.tsx` renders every other page from `src/content/`.
- Page copy lives in `src/content/copy.json`, generated from the approved copy document by `scripts/copydoc.py`.
- `src/demos/` holds the animated product screens; `src/kit/` is the animation kit they run on.
- `sh build.sh` makes the flat, file-only preview build used for review. It is not the production build.
- Third-party credits and licences: `THIRD-PARTY.md`.
