# AI Marketing Suite – Coin & Subscription SaaS

## Features
- 3D landing page with Three.js
- 6 AI tools: Keyword Finder, YouTube Script, Instagram Captions, TikTok Hooks, Thumbnail Creator, Content Calendar
- Coin system: earn by watching ads (Adsterra), daily login, referrals, or buy packs
- Premium subscription ($15/mo) – unlimited access, no ads
- Stripe integration for subscriptions & coin packs
- Supabase for auth, wallet, transactions

## Setup
1. Clone this repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your keys
4. Run `npm run dev`

## Environment Variables (see .env.local)
- Supabase URL & keys
- Stripe secret & publishable keys
- Stripe webhook secret
- Adsterra ad unit ID
- OpenAI or Groq API key

## Database Schema (run in Supabase SQL editor)
See instructions in README of your repo or the code comments.
