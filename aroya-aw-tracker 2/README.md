# AROYA aW Tracker

Live water-activity leaderboard + lead-capture app for the Proper Doinks
High Rollers Live Show. Built Next.js 14 (App Router) on Supabase.

**Two QR codes drive traffic:**
- `/` — public leaderboard of live aW readings (QR #1: "Live aW")
- `/request` — cultivator lead-capture form (QR #2: "Get aW on your flower")

**One gated admin URL:**
- `/admin` — Aroya tech + event lead enter readings (shared password)

## Stack
- Next.js 14 (App Router, Server Actions, RSC)
- Supabase (Postgres + Storage)
- Tailwind + AROYA design tokens (see `app/globals.css`)
- TypeScript
- Deployed to Vercel free tier

## Design system
Pulled from the AROYA design skill. Hard rules:
- Olive `#635e51` + lime `#cbeeb0` only — never generic AgTech green
- Medium 500 only — never 700
- Borders over shadows (`1px solid #ebebea`)
- 8pt spacing scale only (`4,8,12,16,24,32,48,64`)
- Inter 400/500 (sans), JetBrains Mono (all numbers, eyebrows), Source Serif Pro (hero + pull-quotes only)
- Tabular numerals on every digit

## Deploy
See `DEPLOY.md` for the step-by-step from Supabase project to live Vercel URL.

## Env vars

See `.env.example`. Four total:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose)
- `ADMIN_PASSWORD` (the password you and the Aroya tech share)

## Local dev

```bash
npm install
cp .env.example .env.local
# Fill in env vars from Supabase
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture notes

- **Public page (`/`)** is server-rendered (dynamic, no caching) for fast first
  paint, then hydrates a client component that subscribes to Supabase Realtime
  for instant updates. A 10-second polling fallback kicks in if websockets
  drop — event wifi can be flaky.
- **Booth display (`/booth`)** is the same live data as `/` but stripped
  down — no hero, no CTA, no footer. Open on the laptop driving the booth
  TV, hit F11 for fullscreen. New readings fade in with a lime pulse.
- **`/request`** uses a server action → Supabase insert via service-role key.
  RLS allows public inserts into `leads` but no public reads.
- **`/admin`** is gated by a middleware cookie check. Login sets an HttpOnly
  cookie valid 12 hours (covers event day + cushion).
- Reading inserts use the service-role key server-side only; RLS denies
  any direct write from the browser.
- **Realtime requires** `alter publication supabase_realtime add table readings;`
  — included in `schema.sql`. Without it, clients fall back to polling.

## Post-event
- Export leads: Supabase Dashboard → Table Editor → `leads` → Download CSV
- Pause writes: change `ADMIN_PASSWORD` to a nonsense value
- Archive: keep the Vercel URL live or redirect it
