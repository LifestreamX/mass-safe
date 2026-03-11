# MassSafe

A modern, full-stack Massachusetts city safety dashboard. Built with Next.js 16, Prisma, NextAuth, CockroachDB, and Leaflet.

## Features
- Search and view Massachusetts cities with crime and safety data
- Save favorite cities to your dashboard (requires Google login)
- See all your saved cities pinned on a map
- Remove saved cities with a modern confirmation modal
- Fully responsive, beautiful UI

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Prisma ORM (CockroachDB)
- NextAuth.js (Google OAuth)
- Tailwind CSS
- Leaflet (OpenStreetMap)

## Setup
1. **Clone the repo:**
   ```sh
   git clone https://github.com/LifestreamX/mass-safe.git
   cd mass-safe
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in:
     - `DATABASE_URL` (CockroachDB connection string)
     - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
     - `NEXTAUTH_SECRET` (random string)
     - `NEXTAUTH_URL` (your deployed URL for production)
4. **Run locally:**
   ```sh
   npm run dev
   ```
5. **Build for production:**
   ```sh
   npm run build
   npm start
   ```

## Deployment
- Set all required environment variables in your deployment platform (Vercel, Netlify, etc.)
- Make sure `NEXTAUTH_URL` matches your deployed domain

## License
MIT
