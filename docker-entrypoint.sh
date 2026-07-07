#!/bin/sh
# Authenticate to Infisical with the Universal Auth machine identity, then run the worker
# with all secrets injected as env vars. The worker code just reads process.env.
# No migration step here: the app repo owns the shared Postgres schema.
set -e

export INFISICAL_TOKEN="$(infisical login --method=universal-auth \
  --client-id="$INFISICAL_UA_CLIENT_ID" \
  --client-secret="$INFISICAL_UA_CLIENT_SECRET" \
  --domain="$INFISICAL_API_URL/api" --plain --silent)"

exec infisical run --projectId="$INFISICAL_PROJECT_ID" --env=prod \
  --domain="$INFISICAL_API_URL/api" --path=/ -- node dist/index.js
