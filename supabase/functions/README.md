# Supabase Edge Functions

This directory contains Supabase Edge Functions that are deployed separately from the SvelteKit app.

## Deployment

Deploy functions using Supabase CLI:

```bash
supabase functions deploy function-name
```

## Structure

Each function should be in its own directory:
```
supabase/functions/
  ├── function-name/
  │   └── index.ts
  └── another-function/
      └── index.ts
```
