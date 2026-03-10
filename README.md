# MassSafe

**Find safer places to live in Massachusetts**

MassSafe is a production-quality full-stack web application that helps Massachusetts residents evaluate whether a city or town is safe before renting or buying a home. Users can search Massachusetts cities or ZIP codes and see crime statistics, a calculated safety score, charts, and map visualizations.

## Features

- 🔍 **Smart Search** - Search Massachusetts cities with autocomplete
- 📊 **Crime Statistics** - View detailed violent and property crime data
- 🎯 **Safety Scores** - Get instant safety ratings from 0-100
- 📈 **Data Visualizations** - Interactive charts showing crime trends and comparisons
- 🗺️ **Map Integration** - Mapbox-powered location visualization
- 🔐 **Authentication** - Sign in with Google OAuth
- 💾 **Save Locations** - Bookmark your favorite cities
- 📱 **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Recharts** for data visualization
- **Mapbox GL JS** for maps

### Backend

- **Next.js API Routes**
- **NextAuth.js** for authentication
- **Prisma ORM**
- **CockroachDB** (Serverless free tier)

### Data Source

- **FBI Crime Data Explorer API**

### Hosting

- **Vercel** (Free tier)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- CockroachDB account (free tier)
- Google OAuth credentials
- Mapbox account (free tier)
- FBI API key (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd masssafe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DATABASE_URL` - CockroachDB connection string
   - `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)
   - `NEXTAUTH_SECRET` - Random secret string for NextAuth
   - `GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
   - `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox public access token
   - `FBI_API_KEY` - FBI Crime Data API key (optional, uses mock data if not provided)

4. **Set up the database**

   ```bash
   # Push the schema to your database
   npm run db:push

   # Seed the database with Massachusetts cities
   npm run db:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Setup Guide

### CockroachDB Setup

1. Go to [cockroachlabs.cloud](https://cockroachlabs.cloud/)
2. Create a free serverless cluster
3. Create a database named `masssafe`
4. Copy the connection string to `DATABASE_URL` in `.env`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### Mapbox Setup

1. Go to [mapbox.com](https://www.mapbox.com/)
2. Create a free account
3. Copy your default public token to `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env`

### FBI API Setup (Optional)

1. Go to [FBI Crime Data Explorer API](https://crime-data-explorer.fr.cloud.gov/pages/docApi)
2. Request an API key
3. Add to `FBI_API_KEY` in `.env`
4. If not provided, the app will use realistic mock data

## Project Structure

```
masssafe/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── city-search/          # City autocomplete API
│   │   ├── crime-data/           # Crime statistics API
│   │   ├── safety-score/         # Safety score calculation API
│   │   └── save-location/        # Save/unsave locations API
│   ├── city/[cityName]/          # Dynamic city detail pages
│   ├── dashboard/                # User dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   ├── providers.tsx             # NextAuth provider
│   └── globals.css               # Global styles
├── components/
│   ├── Charts.tsx                # Recharts components
│   ├── CityCard.tsx              # City card component
│   ├── Footer.tsx                # Footer component
│   ├── Header.tsx                # Header with auth
│   ├── MapView.tsx               # Mapbox integration
│   ├── SafetyScore.tsx           # Safety score display
│   ├── SaveButton.tsx            # Save location button
│   └── SearchBar.tsx             # Search with autocomplete
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── crime-api.ts              # FBI API integration
│   ├── prisma.ts                 # Prisma client
│   ├── safety-score.ts           # Safety score calculation
│   └── types.ts                  # TypeScript types
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## API Routes

### Public Routes

- `GET /api/city-search?q={query}` - Search cities with autocomplete
- `GET /api/crime-data?city={cityName}` - Get crime statistics for a city
- `POST /api/safety-score` - Calculate safety score from crime data

### Protected Routes (Require Authentication)

- `POST /api/save-location` - Save a city to favorites
- `DELETE /api/save-location?id={locationId}` - Remove saved location
- `GET /api/save-location` - Get user's saved locations

## Database Schema

### User

- Stores user authentication data from Google OAuth

### City

- 50+ Massachusetts cities and towns
- Population, coordinates, county information

### SavedLocation

- User's bookmarked cities
- Links users to cities with safety scores

### CrimeCache

- Cached crime statistics from FBI API
- Reduces API calls and improves performance

## Safety Score Algorithm

The safety score is calculated using the following formula:

```typescript
violentCrimeRate = (violentCrimes / population) * 1000;
propertyCrimeRate = (propertyCrimes / population) * 1000;

safetyScore = 100 - (violentCrimeRate * 2 + propertyCrimeRate);

// Clamped between 0-100
```

**Rating Scale:**

- 80-100: Excellent (Green)
- 60-79: Good (Yellow)
- 40-59: Fair (Orange)
- 0-39: Poor (Red)

Violent crimes are weighted 2x higher than property crimes.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Push Prisma schema to database
npm run db:push

# Seed database with cities
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically:

- Install dependencies
- Run `prisma generate`
- Build the Next.js app
- Deploy to production

## Future Features

- 🏘️ Neighborhood-level safety data
- 🏫 School ratings integration
- 💰 Rent estimate comparison
- 🚶 Walkability scores
- ⚖️ Side-by-side city comparison
- 🔥 Crime heatmap for Massachusetts
- 📧 Email alerts for saved cities
- 📱 Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

Crime statistics are provided for informational purposes only and may not reflect real-time conditions. Always conduct thorough research and visit neighborhoods in person before making housing decisions.

## Credits

- Crime data from FBI Crime Data Explorer API
- Map visualization by Mapbox
- Built with Next.js, React, and TypeScript
- Charts powered by Recharts

---

**Made with ❤️ for safer Massachusetts communities**
