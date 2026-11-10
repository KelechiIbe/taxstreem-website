# Putting the new website on Cloud Run

This puts the new site up as its own Cloud Run service with a `.run.app` address. It does not touch the
current website, its service or the `taxstreem.com` domain. Moving the domain is a separate, later job
(last section).

## What gets created

| | |
| --- | --- |
| Service | `taxstreem-web-v2` |
| Project | the production project (number `61341992308`, the one the CMS backend and admin portal run in) |
| Region | `us-central1` |
| Access | public, no sign-in |
| Size | 512 MB, 1 CPU, 0 to 6 instances, port 8080 |
| Image | built by Cloud Build from the `Dockerfile`, kept in Artifact Registry under `cloud-run-source-deploy` |

No secrets are involved. The three settings live in `.env.production` and are all public addresses.

## Access you need

Project Owner is enough. Without Owner, the person deploying needs Cloud Run Source Developer
(`roles/run.sourceDeveloper`), Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`) and
Service Account User (`roles/iam.serviceAccountUser`) on the Cloud Run service identity.

## Steps

1. Open https://console.cloud.google.com, pick the production project in the project menu at the top, then
   click the Cloud Shell button (the `>_` icon, top right). A terminal opens at the bottom of the page.

2. Get the code:

   ```sh
   git clone https://github.com/KelechiIbe/taxstreem-website.git
   cd taxstreem-website
   ```

3. Deploy:

   ```sh
   sh deploy.sh
   ```

   If Cloud Shell asks you to authorise, click Authorise. The script then:

   - picks the production project and switches on the Cloud Run, Cloud Build and Artifact Registry APIs;
   - refuses to continue if a service called `taxstreem-web-v2` already exists and is something else;
   - finds the current website's own `.run.app` address among the project's services and saves it as
     `LEGACY_SITE_URL` in `.env.production` (the reason is in the next section);
   - builds the container and deploys it. This takes about five minutes.

   It ends by printing `Deployed: https://taxstreem-web-v2-….run.app`. That is the address.

4. Check these on the new address:

   | Open | Expect |
   | --- | --- |
   | `/` | the new home page, films playing |
   | `/pricing`, `/modules`, `/integrations`, `/about`, `/tax-professionals` | new pages |
   | `/resources`, then any article | articles, video and The Bridge from the CMS |
   | `/newsroom` | press items from the CMS |
   | `/get-invite`, `/privacy`, `/terms` | the current site's pages, served through the new address |
   | `/products` | lands on `/find-my-product` |

## If the script stops

**"could not single out the current website"**. The current site's service is in another project, or its
`.run.app` address does not answer the public (ingress set to internal and load balancer only). Find the
service in the Cloud Run console, copy the URL at the top of its page, and put it in `.env.production`:

```sh
nano .env.production      # LEGACY_SITE_URL=https://<old-service>….run.app   then Ctrl+O, Enter, Ctrl+X
sh deploy.sh
```

It must be the `.run.app` address, never `www.taxstreem.com`: once the domain points at the new service,
the public domain would send those pages round in a circle. If the old service only answers through the load
balancer, set its ingress to "All" first, or the six pages below will not open on the new site.

**A permission error during the build**. The Cloud Build service account lacks the builder role. Grant it
and run the script again:

```sh
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:61341992308-compute@developer.gserviceaccount.com --role=roles/run.builder
```

**"a service named taxstreem-web-v2 already exists"**. Pick another name: `SERVICE=another-name sh deploy.sh`.

**A different project or region**: `PROJECT=project-id REGION=europe-west1 sh deploy.sh`.

## What still comes from the current website

`/get-invite`, `/privacy`, `/terms`, `/the-bridge`, `/get-on-rev360` and `/demo` are not rebuilt in this
project. The new server passes those addresses, and the scripts, styles and pictures they ask for, through to
`LEGACY_SITE_URL`. So the old service has to stay running, before and after the domain moves.

## Two things that behave differently on the temporary address

- **Forms.** The newsletter and contact forms post from the browser to
  `https://internal-core-api.taxstreem.com/api/v1` (`/newsletter/subscribe`, `/contact/submit`). That API
  answers `https://www.taxstreem.com` and no other origin (checked with a preflight on 10 Nov 2026), so on
  the `.run.app` address both forms show "could not send". To test them before the domain moves, add the new
  `.run.app` address to the API's allowed origins. Once the site is on `www.taxstreem.com` they work as is.
- **Search engines.** Every page of the new site served on a `.run.app` host carries `X-Robots-Tag: noindex, nofollow`, so the
  rehearsal copy stays out of Google. The header is absent on `www.taxstreem.com`.

## Updating later

```sh
cd taxstreem-website && git pull && sh deploy.sh
```

Articles, videos, press items and events need no redeploy. They come from the CMS and refresh every five
minutes.

## Rolling back or removing

Each deploy is a revision. Cloud Run console, the service, Revisions, "Manage traffic" sends visitors back to
an earlier one. To remove the service altogether: `gcloud run services delete taxstreem-web-v2 --region us-central1`.

## When the domain moves (later)

1. Leave the old website service running and public. The new one depends on it for the six pages above.
2. Point `www.taxstreem.com` and `taxstreem.com` at `taxstreem-web-v2`, by the same means they point at the
   old service today (Cloud Run domain mapping or the load balancer's backend).
3. Redeploy with one warm instance so the first visitor never waits: `MIN_INSTANCES=1 sh deploy.sh`.
4. Check `/`, `/get-invite`, an article and both forms on `www.taxstreem.com`.
