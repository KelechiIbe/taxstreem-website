#!/bin/sh
# Puts the TaxStreem website on Cloud Run as its own service. It does not touch the current website or the domain.
#
#   sh deploy.sh                       deploy to the project Cloud Shell is set to (it asks first)
#   PROJECT=my-project sh deploy.sh    deploy to a named project
#   SERVICE=…  REGION=…                other service name or region
#   YES=1                              skip the question
set -e
cd "$(dirname "$0")"
SERVICE="${SERVICE:-taxstreem-web-v2}"
REGION="${REGION:-us-central1}"
MARK="Tax Compliance Finally on"          # words only the new home page carries

# 1. Which project. The one Cloud Shell is set to, unless PROJECT says otherwise. Nothing is assumed.
[ -n "$PROJECT" ] || PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT" ] || [ "$PROJECT" = "(unset)" ]; then
  echo "Stop: no project is selected. Run it as  PROJECT=your-project-id sh deploy.sh"
  exit 1
fi
NUMBER=$(gcloud projects describe "$PROJECT" --format="value(projectNumber)" 2>/dev/null || true)
case "$NUMBER" in
  61341992308)  KIND="PRODUCTION";;
  356183719853) KIND="staging";;
  *)            KIND="neither the known staging nor production project";;
esac
echo "Project: $PROJECT ($KIND)   Service: $SERVICE   Region: $REGION"
if [ -z "$YES" ] && [ -t 0 ]; then
  printf "Publish the website there? [y/N] "
  read ANSWER
  case "$ANSWER" in y|Y|yes|YES) ;; *) echo "Stopped. Nothing was changed."; exit 1;; esac
fi

# 2. Switch on what Cloud Run needs to build from source. Safe to repeat.
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project "$PROJECT" --quiet

# 3. Never overwrite a service that is not this website.
EXISTING=$(gcloud run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format="value(status.url)" 2>/dev/null || true)
if [ -n "$EXISTING" ] && ! curl -fsSL -m 20 "$EXISTING/" 2>/dev/null | grep -q "$MARK"; then
  echo "Stop: a service named $SERVICE already exists at $EXISTING and it is not this website."
  echo "Choose another name:  SERVICE=another-name sh deploy.sh"
  exit 1
fi

# 4. The current website's own Cloud Run address. Sign-up, privacy, terms and The Bridge are still served from it.
LEGACY=$(grep -E '^LEGACY_SITE_URL=' .env.production | cut -d= -f2-)
if [ -z "$LEGACY" ]; then
  echo "Looking for the current website among this project's Cloud Run services…"
  FOUND=""
  for U in $(gcloud run services list --project "$PROJECT" --format="value(status.url)" 2>/dev/null); do
    [ "$U" = "$EXISTING" ] && continue
    if curl -fsSL -m 20 "$U/get-invite" 2>/dev/null | grep -q "<title>Sign Up"; then FOUND="$FOUND $U"; fi
  done
  set -- $FOUND
  if [ "$#" -eq 1 ]; then
    LEGACY="$1"
    sed -i.bak "s|^LEGACY_SITE_URL=.*|LEGACY_SITE_URL=$LEGACY|" .env.production && rm -f .env.production.bak
    echo "Found it: $LEGACY (saved to .env.production)"
  else
    echo "Stop: could not single out the current website (matches:${FOUND:- none})."
    echo "Open .env.production and set LEGACY_SITE_URL to its .run.app address, then run this again."
    exit 1
  fi
fi
case "$LEGACY" in
  *taxstreem.com*) echo "Stop: LEGACY_SITE_URL must be the old site's .run.app address, not the public domain (requests would loop once the domain moves)."; exit 1;;
esac

# 5. Build and deploy. Takes about five minutes.
gcloud run deploy "$SERVICE" --source . --project "$PROJECT" --region "$REGION" --quiet \
  --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1 --min-instances "${MIN_INSTANCES:-0}" --max-instances 6

URL=$(gcloud run services describe "$SERVICE" --project "$PROJECT" --region "$REGION" --format="value(status.url)")
echo
echo "Deployed: $URL"
echo "Check:    $URL/   $URL/pricing   $URL/resources   $URL/get-invite"
