# TaxStreem CMS (read 10 Nov 2026)

Base: https://taxstreem-cms-backend-356183719853.us-central1.run.app
Docs: /swagger (page), /swagger/json (OpenAPI, "TaxStreem CMS API 0.1.0"). No response schemas in the spec.

Public, no key needed (all GET returned 200 without auth):
- /api/v1/public/articles            -> { articles: [] }      ; /articles/{slug} returns the article with 3 related
- /api/v1/public/guides              -> { guides: [] }        ; /guides/{slug}
- /api/v1/public/reports             -> { reports: [] }       ; /reports/{slug}
- /api/v1/public/videos              -> { videos: [] }        ; /videos/{slug}
- /api/v1/public/demos?category&page -> { demos: [] }         ; /demos/{slug}
- /api/v1/public/newsroom            -> { items: [] }
- /api/v1/public/events?type         -> { code, message, data: { events: [] } } ; /events/upcoming, /events/future
- POST /api/v1/public/events/{id}/register

Fields, from the create forms (the public responses were empty on this instance):
- article: title, excerpt, category, coverImage, coverCaption, readTime, body[] (blocks), featured, status, slug
- resource (guide/report): kind, title, summary, category, coverImage, body[], pdfFileUrl, htmlFileUrl, featured, status, slug
- video: title, description, category, thumbnail, videoUrl, durationSeconds, featured, status, slug
- newsroom: title, excerpt, category, publication, externalUrl, thumbnail, featured, status, slug
- demo: title, description, category, page, videoUrl, thumbnail, status, slug

Missing: nothing for open roles (Careers) and nothing for newsletter sign-ups.
Open: every public list was empty on this instance, while www.taxstreem.com shows published items with images in
storage.googleapis.com/taxstreem_bucket_production/cms/images/... so production content may live on another instance.

# Forms (read 10 Nov 2026 from the live site's own scripts)
Staff read these in the admin portal (https://admin-portal-61341992308.us-central1.run.app), which talks to https://internal-core-api.taxstreem.com.
- Newsletter: POST /api/v1/newsletter/subscribe { email, firstName } -> 201 new, 200 already subscribed, else { message }
- Contact:    POST /api/v1/contact/submit { fullName, email, company, role, message, website } (website is a trap field, left empty) -> 429 rate limit
  roles the live form offers: Business owner, Finance team, Accountant, Tax professional, Developer or platform, Other
Never tested against production from here; verified with the service replaced by a stand-in.
