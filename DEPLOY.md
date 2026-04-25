# DEPLOY — 10-minute checklist from zero to live

Do these in order. You'll be at a live URL with both QR codes working in
under 10 minutes once you have wifi.

---

## 0. Before you start (30 seconds)

- [ ] Laptop with wifi
- [ ] GitHub account logged in
- [ ] Vercel account (sign in with GitHub — same login)
- [ ] Supabase account (free — [supabase.com](https://supabase.com))
- [ ] This project unzipped locally

---

## 1. Supabase project (3 min)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. Name it `aroya-aw-tracker`. Pick a region close to you (us-west-1 for West Coast).
3. Set a database password (save it in your password manager — you won't need it for this app, but Supabase wants one).
4. Wait ~60 seconds for it to provision.
5. Once ready, go to **SQL Editor** → **New query** → paste the contents of `schema.sql` from this repo → **Run**.
6. Go to **Project Settings → API**. You'll need three values:
   - **Project URL** → copy for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → copy for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → copy for `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep secret)

---

## 2. Push to GitHub (1 min)

From the project folder:

```bash
git init
git add .
git commit -m "initial"
gh repo create aroya-aw-tracker --private --source=. --push
```

(Or use the GitHub website — create empty repo, then `git remote add origin <url>` and `git push -u origin main`.)

---

## 3. Deploy to Vercel (2 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `aroya-aw-tracker` repo
3. Framework: **Next.js** (auto-detected)
4. Expand **Environment Variables** and paste all four:
   - `NEXT_PUBLIC_SUPABASE_URL` → (from Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → (from Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY` → (from Supabase)
   - `ADMIN_PASSWORD` → pick something short+memorable that you and the Aroya tech will use (e.g. `highroller2026`)
5. Click **Deploy**. Wait ~90 seconds.
6. You'll get a URL like `aroya-aw-tracker-xyz.vercel.app`. That's live.

---

## 4. Smoke test (2 min)

On your phone, hit these URLs:

- [ ] `https://<your-vercel-url>/admin` → should redirect to `/admin/login`
- [ ] Enter the password → should land on the admin form
- [ ] Fill in a test reading (contestant "Test", strain "Test OG", aW `0.612`) → Submit
- [ ] Green success banner should appear
- [ ] Visit `https://<your-vercel-url>/` → test reading should be on the leaderboard
- [ ] Visit `https://<your-vercel-url>/request` → submit a test lead
- [ ] In Supabase Dashboard → Table Editor → `leads` → verify row

If all 6 pass, you're live. Delete the test reading from `/admin` before showtime.

---

## 5. Generate QR codes (2 min)

Two QR codes for the event. Use [qr-code-generator.com](https://www.qr-code-generator.com) or any QR tool — vector SVG ideal for print.

### QR #1 — Live aW leaderboard
- URL: `https://<your-vercel-url>/`
- Label under QR: **"LIVE aW — Scan for live readings"**

### QR #2 — Lead capture
- URL: `https://<your-vercel-url>/request`
- Label under QR: **"GET aW ON YOUR FLOWER — Scan to request testing"**

### Bonus: Booth TV display
- URL: `https://<your-vercel-url>/booth`
- Open this on the laptop driving your booth screen, then F11 for fullscreen.
- Same live data as `/`, but no hero/CTA clutter — just readings + real-time pulse.
- New readings fade-in with a lime pulse animation. Updates are instant (Supabase Realtime), with a 10-second poll as fallback.

Print both QR codes on cardstock, put them at the Aroya booth. Larger is better —
500px minimum on whatever you print to.

### Pro tip
If you want vanity URLs for printing, go to Vercel → Project → Settings →
Domains and add a custom domain. For today, skip it — the `vercel.app`
URL is fine under a QR code.

---

## 6. Hand-off to the Aroya tech (30 seconds)

Send them a text with:
- The `/admin` URL
- The password
- This reminder: "Photos are optional. The only required fields are
  contestant, strain, bracket, and aW."

Show them the form once so they know what to expect.

---

## During the event

- Readings flow to the public page within ~30 seconds of being saved (that's the `revalidate = 30`)
- If you need the public page to update instantly, hard-refresh the public display screen — it won't hit cache
- If the Aroya tech mistypes, they can delete from the "Last 10 readings" list on `/admin`

---

## After the event

**Export leads:**
- Supabase Dashboard → Table Editor → `leads` → ⋯ menu → Download CSV

**Pause entries:**
- Vercel → Project → Settings → Environment Variables → edit `ADMIN_PASSWORD` to something nonsense. Redeploy (or wait for next auto-deploy).

**Keep it up forever:**
- Vercel free tier + Supabase free tier = $0/month. You can leave it running as a permanent archive.

---

## Troubleshooting

**"Error: ADMIN_PASSWORD not set"**
→ Vercel → Settings → Environment Variables → add it → Redeploy

**Readings don't appear on `/`**
→ Should be instant via Supabase Realtime. If they're not:
1. Verify the `alter publication supabase_realtime add table readings;` line ran without error when you pasted `schema.sql`. If you skipped that, go to Supabase → Database → Replication → enable realtime on the `readings` table manually.
2. Open the booth page (`/booth`), open devtools → Network → WS tab — you should see a websocket connection to supabase. If it's missing, check `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
3. Worst case: the 10-second polling fallback will still catch new readings even if realtime is broken.

**Photo upload fails**
→ Make sure the `sample-photos` bucket exists in Supabase Storage and is set to public. The `schema.sql` creates it, but double-check.

**`/request` shows 500**
→ Usually a missing env var. Check Vercel logs.
