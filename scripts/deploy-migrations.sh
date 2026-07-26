#!/usr/bin/env bash
# Pushes supabase/migrations/*.sql to the linked Supabase project.
#
# Requires the Supabase CLI (https://supabase.com/docs/guides/cli) and a
# project already linked via `supabase link --project-ref <ref>`.
#
# This only pushes schema migrations — it does not run supabase/seed.sql
# against production (seed data is for local/dev only).

set -euo pipefail

if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI not found. Install it first: https://supabase.com/docs/guides/cli/getting-started" >&2
  exit 1
fi

echo "This will push all pending migrations in supabase/migrations/ to the"
echo "linked Supabase project. Make sure you have run 'supabase link' first"
echo "and that you're pointed at the correct project."
echo
read -r -p "Continue? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

supabase db push
