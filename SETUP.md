# MassSafe - Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database (CockroachDB)
DATABASE_URL="postgresql://user:password@host:26257/masssafe?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# FBI Crime Data API (Optional - uses mock data if not provided)
FBI_API_KEY="your-fbi-api-key"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

### 3. Set Up Database

```bash
# Push the Prisma schema to your database
npm run db:push

# Seed the database with Massachusetts cities
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Generate Secrets

For `NEXTAUTH_SECRET`, generate a random string:

```bash
openssl rand -base64 32
```

## Free Tier Services

### CockroachDB (Database)

1. Sign up at https://cockroachlabs.cloud/
2. Create a free serverless cluster
3. Create database: `masssafe`
4. Copy connection string

### Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### Mapbox (Maps)

1. Sign up at https://www.mapbox.com/
2. Copy your default public token

### FBI API (Optional)

1. Visit https://crime-data-explorer.fr.cloud.gov/pages/docApi
2. Request API key
3. Note: App works with mock data if no API key

## Troubleshooting

**Issue: Prisma Client not found**

```bash
npx prisma generate
```

**Issue: Database connection failed**

- Check your DATABASE_URL format
- Ensure CockroachDB cluster is running
- Verify SSL settings

**Issue: Google OAuth not working**

- Verify redirect URI is correctly set
- Check CLIENT_ID and SECRET are correct
- Make sure Google+ API is enabled

**Issue: Map not loading**

- Verify NEXT_PUBLIC_MAPBOX_TOKEN is set
- Check Mapbox account is active
- Ensure token is public (starts with 'pk.')

## Project Structure

```
Key Directories:
- /app          - Next.js pages and routes
- /components   - React components
- /lib          - Utilities and helpers
- /prisma       - Database schema and seeds
```

## Useful Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run db:push     # Update database schema
npm run db:seed     # Seed database
npm run db:studio   # Open Prisma Studio
```

## Next Steps

1. Search for a Massachusetts city
2. View crime statistics and safety scores
3. Sign in with Google
4. Save your favorite cities
5. Check your dashboard

## Need Help?

Check the full README.md for detailed documentation.
