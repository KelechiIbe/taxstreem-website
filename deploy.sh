#!/bin/sh
# Puts the website on Cloud Run. Usage: sh deploy.sh            (uses your current gcloud project)
#                                       PROJECT=my-project sh deploy.sh
set -e
cd "$(dirname "$0")"
LEGACY=$(grep -E '^LEGACY_SITE_URL=' .env.production | cut -d= -f2-)
if [ -z "$LEGACY" ]; then
  echo "Stop: LEGACY_SITE_URL is empty in .env.production."
  echo "Set it to the Cloud Run address of the current website, or sign-up, privacy, terms and The Bridge will not open."
  exit 1
fi
case "$LEGACY" in *www.taxstreem.com*|*//taxstreem.com*) echo "Stop: LEGACY_SITE_URL must be the old site's .run.app address, not the public domain."; exit 1;; esac
gcloud run deploy "${SERVICE:-taxstreem-website}" --source . --region "${REGION:-us-central1}" ${PROJECT:+--project "$PROJECT"} \
  --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1 --min-instances "${MIN_INSTANCES:-0}" --max-instances 6
