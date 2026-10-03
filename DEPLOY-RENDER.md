# NicheLearn — Render deployment

This version is adapted for Render as a Node.js web service. It no longer depends on Cloudflare Pages Functions or Cloudflare D1.

## 1. Deploy the repository

1. Push this folder to GitHub.
2. In Render choose **New → Web Service**.
3. Connect the GitHub repository.
4. Use:
   - Runtime: Node
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/healthz`
   - Plan: Free for testing
5. Create the service.

Render automatically redeploys when the linked branch receives changes. urlRender Web Services documentationhttps://render.com/docs/web-services

## 2. Add a Postgres database

NicheLearn uses PostgreSQL for users, sessions, memberships, playlists, usage limits, and PayPal webhook records.

Create **New → Postgres** in Render and choose the Free plan if you are only testing. Render's current free Postgres database is 1 GB and expires after 30 days, so upgrade or migrate before using it for long-term production data. urlRender free resources documentationhttps://render.com/docs/free

Connect the database to the web service using Render's `DATABASE_URL` environment variable (or the database's Internal Database URL).

## 3. Environment variables

Required for the database/auth/search app:

- `DATABASE_URL`
- `USAGE_HASH_SECRET` — generate a long random value
- `YOUTUBE_API_KEY` — optional provider
- `BRAVE_SEARCH_API_KEY` — optional provider
- `LISTEN_NOTES_API_KEY` — optional provider
- `GOOGLE_BOOKS_API_KEY` — optional; Google Books can work without it within provider limits

PayPal variables, only when billing is ready:

- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_PRO_MONTHLY_PLAN_ID`
- `PAYPAL_PRO_YEARLY_PLAN_ID`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_BASE_URL` — use `https://api-m.sandbox.paypal.com` for sandbox testing, then `https://api-m.paypal.com` for live
- optional `PAYPAL_RETURN_URL`
- optional `PAYPAL_CANCEL_URL`

Do not put secrets in GitHub or in frontend JavaScript.

## 4. Important free-tier limitation

Render Free web services can spin down after 15 minutes without traffic. Free Postgres currently expires after 30 days. These are suitable for testing/prototyping, not permanent production storage. urlRender free resources documentationhttps://render.com/docs/free

## 5. Smoke test

After deployment:

- Open the Render URL.
- Open `/healthz` and confirm `{ "ok": true }`.
- Register a test account.
- Sign in/out.
- Run a search after adding at least one search-provider API key.
- Test playlist creation if desired.
- Test PayPal in Sandbox before using Live credentials.

## Architecture change

The UI and search/provider logic are retained. The backend is now Express + PostgreSQL so Render can run it as a normal Node.js Web Service. The old Cloudflare `functions/`, Wrangler, Pages, and D1 deployment files were removed from this Render package.
