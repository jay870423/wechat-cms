# WeChat CMS

A Next.js 14 + Supabase starter for a WeChat content management system.

## Quick start

1. Copy the env template:

   cp .env.example .env.local

2. Install dependencies:

   npm install

3. Run the app:

   npm run dev

## Features

- Bilingual UI (English/中文) with a language toggle
- Supabase Auth login/signup and protected routes
- Google + GitHub OAuth login (server-side exchange)
- Realtime dashboard updates via Supabase Realtime
- WeChat publish flow (draft + free publish) from the editor

## WeChat publish notes

- You need a valid `thumb_media_id` from WeChat to create a draft.
- Set `WECHAT_APP_ID` and `WECHAT_APP_SECRET` in your environment.

## OAuth setup (Google/GitHub)

1. Supabase → Authentication → Providers → enable Google and GitHub.
2. Add the callback URL in each provider:
   - `http://localhost:3000/auth/callback`
   - Your production domain: `https://your-domain.com/auth/callback`
3. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.

## Supabase schema

Open the Supabase SQL editor and run:

supabase/migrations/0001_init.sql

## API endpoints

- GET /api/health
- GET /api/articles
- POST /api/articles
- PATCH /api/articles
- GET /api/wechat/token
- POST /api/wechat/publish
- GET /api/wechat/messages

## Deployment

- Create a Vercel project and add the variables from .env.local.
- Make sure your WeChat IP whitelist allows the Vercel deployment.
# wechat-cms
