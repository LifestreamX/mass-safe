safetyScore = 100 - (violentCrimeRate \* 2 + propertyCrimeRate);

# MassSafe

Find safer places to live in Massachusetts.

## Features

- Search Massachusetts cities
- View crime statistics and safety scores
- Interactive charts and map visualizations
- Sign in with Google (optional)
- Save favorite cities (optional)

## Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- Prisma ORM + CockroachDB
- NextAuth.js (Google OAuth)
- Recharts (charts)
- Mapbox GL JS (maps)
- FBI Crime Data Explorer API

## Quick Start

1. Clone the repo and install dependencies:
   ```bash
   git clone <repository-url>
   cd masssafe
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in required variables:
   - `DATABASE_URL` (CockroachDB)
   - `NEXTAUTH_URL` (http://localhost:3000)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `FBI_API_KEY` (optional)
3. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `app/` - Pages, API routes, layout
- `components/` - UI components
- `lib/` - Utility libraries (auth, API, types)
- `prisma/` - Database schema and seed

## API Endpoints

- `GET /api/city-search?q={query}` - City autocomplete
- `GET /api/crime-data?city={cityName}` - Crime stats
- `POST /api/safety-score` - Calculate safety score
- `POST/DELETE/GET /api/save-location` - Manage saved cities (auth required)

### Data File

- The file `ma_crime_overview_2024.json` is used for seeding the database and is **git-ignored** by default. If you need to re-seed, place the file in the project root.
