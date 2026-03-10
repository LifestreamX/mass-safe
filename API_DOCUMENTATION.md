# MassSafe API Documentation

## Base URL

**Development**: `http://localhost:3000/api`  
**Production**: `https://your-app-name.vercel.app/api`

---

## Public Endpoints

### 1. Search Cities

Search for Massachusetts cities with autocomplete.

**Endpoint**: `GET /api/city-search`

**Query Parameters**:

- `q` (string, required): Search query (minimum 2 characters)

**Example Request**:

```bash
GET /api/city-search?q=bost
```

**Example Response**:

```json
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9i0j1",
    "name": "Boston",
    "county": "Suffolk",
    "population": 675647
  },
  {
    "id": "clx2b3c4d5e6f7g8h9i0j1k2",
    "name": "Boston Harbor Islands",
    "county": "Suffolk",
    "population": 0
  }
]
```

**Status Codes**:

- `200`: Success
- `500`: Server error

---

### 2. Get Crime Data

Fetch crime statistics for a specific city. Uses cached data when available.

**Endpoint**: `GET /api/crime-data`

**Query Parameters**:

- `city` (string, required): City name

**Example Request**:

```bash
GET /api/crime-data?city=Cambridge
```

**Example Response**:

```json
{
  "violentCrime": 180,
  "propertyCrime": 1800,
  "year": 2024,
  "cached": true
}
```

**Status Codes**:

- `200`: Success
- `400`: Missing city parameter
- `404`: City not found
- `500`: Server error

**Caching**:

- Data is cached for 30 days
- `cached: true` indicates data from cache
- `cached: false` indicates fresh API fetch

---

### 3. Calculate Safety Score

Calculate safety score from crime statistics.

**Endpoint**: `POST /api/safety-score`

**Request Body**:

```json
{
  "violentCrimes": 180,
  "propertyCrimes": 1800,
  "population": 118403
}
```

**Example Response**:

```json
{
  "score": 78.3,
  "violentCrimeRate": 1.52,
  "propertyCrimeRate": 15.2,
  "rating": "good",
  "color": "#f59e0b"
}
```

**Status Codes**:

- `200`: Success
- `400`: Invalid input data
- `500`: Server error

**Score Calculation**:

```
violentCrimeRate = (violentCrimes / population) × 1000
propertyCrimeRate = (propertyCrimes / population) × 1000
score = 100 - (violentCrimeRate × 2 + propertyCrimeRate)
score = clamp(score, 0, 100)
```

**Rating Scale**:

- `80-100`: excellent (green)
- `60-79`: good (yellow)
- `40-59`: fair (orange)
- `0-39`: poor (red)

---

## Protected Endpoints

All protected endpoints require authentication via NextAuth session.

### Authentication

Include session cookie in requests. Frontend automatically handles this when using `next-auth` hooks.

**Error Response** (401 Unauthorized):

```json
{
  "error": "Unauthorized"
}
```

---

### 4. Save Location

Save a city to user's favorites.

**Endpoint**: `POST /api/save-location`

**Authentication**: Required

**Request Body**:

```json
{
  "cityId": "clx1a2b3c4d5e6f7g8h9i0j1",
  "safetyScore": 78.3
}
```

**Example Response**:

```json
{
  "id": "clx3c4d5e6f7g8h9i0j1k2l3",
  "userId": "clx4d5e6f7g8h9i0j1k2l3m4",
  "cityId": "clx1a2b3c4d5e6f7g8h9i0j1",
  "safetyScore": 78.3,
  "createdAt": "2026-03-08T12:00:00.000Z",
  "city": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j1",
    "name": "Cambridge",
    "county": "Middlesex",
    "population": 118403,
    "latitude": 42.3736,
    "longitude": -71.1097,
    "state": "Massachusetts"
  }
}
```

**Status Codes**:

- `200`: Success
- `400`: Missing cityId
- `401`: Unauthorized
- `404`: User or city not found
- `409`: Location already saved
- `500`: Server error

---

### 5. Get Saved Locations

Retrieve all saved locations for authenticated user.

**Endpoint**: `GET /api/save-location`

**Authentication**: Required

**Example Response**:

```json
[
  {
    "id": "clx3c4d5e6f7g8h9i0j1k2l3",
    "userId": "clx4d5e6f7g8h9i0j1k2l3m4",
    "cityId": "clx1a2b3c4d5e6f7g8h9i0j1",
    "safetyScore": 78.3,
    "createdAt": "2026-03-08T12:00:00.000Z",
    "city": {
      "id": "clx1a2b3c4d5e6f7g8h9i0j1",
      "name": "Cambridge",
      "county": "Middlesex",
      "population": 118403,
      "latitude": 42.3736,
      "longitude": -71.1097,
      "state": "Massachusetts"
    }
  }
]
```

**Status Codes**:

- `200`: Success
- `401`: Unauthorized
- `404`: User not found
- `500`: Server error

---

### 6. Delete Saved Location

Remove a saved location from user's favorites.

**Endpoint**: `DELETE /api/save-location`

**Authentication**: Required

**Query Parameters**:

- `id` (string, required): Saved location ID

**Example Request**:

```bash
DELETE /api/save-location?id=clx3c4d5e6f7g8h9i0j1k2l3
```

**Example Response**:

```json
{
  "success": true
}
```

**Status Codes**:

- `200`: Success
- `400`: Missing location ID
- `401`: Unauthorized
- `404`: User not found
- `500`: Server error

---

## Authentication Endpoints

### NextAuth

MassSafe uses NextAuth.js for authentication.

**Base Path**: `/api/auth`

**Provider**: Google OAuth

**Endpoints** (handled by NextAuth):

- `GET /api/auth/signin`: Sign in page
- `GET /api/auth/signout`: Sign out
- `GET /api/auth/session`: Get session
- `GET /api/auth/csrf`: CSRF token
- `POST /api/auth/signin/:provider`: Sign in with provider
- `POST /api/auth/signout`: Sign out POST
- `GET /api/auth/callback/:provider`: OAuth callback

**Session Response**:

```json
{
  "user": {
    "id": "clx4d5e6f7g8h9i0j1k2l3m4",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://lh3.googleusercontent.com/..."
  },
  "expires": "2026-04-08T12:00:00.000Z"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid input or missing parameters
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., already saved)
- `500 Internal Server Error`: Server-side error

---

## Rate Limiting

**Current**: No rate limiting implemented

**Recommended for Production**:

- Rate limit: 100 requests per minute per IP
- Burst: Allow up to 10 requests per second
- Implementation: Use Vercel Edge Config or Upstash

---

## Data Models

### City

```typescript
{
  id: string;
  name: string;
  county: string;
  population: number;
  latitude: number;
  longitude: number;
  state: string;
}
```

### Crime Data

```typescript
{
  violentCrime: number;
  propertyCrime: number;
  year: number;
  cached: boolean;
}
```

### Safety Score

```typescript
{
  score: number;
  violentCrimeRate: number;
  propertyCrimeRate: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
}
```

### Saved Location

```typescript
{
  id: string;
  userId: string;
  cityId: string;
  safetyScore: number | null;
  createdAt: Date;
  city: City;
}
```

---

## Client-Side Usage

### React Example (with fetch)

```typescript
// Search cities
const searchCities = async (query: string) => {
  const response = await fetch(
    `/api/city-search?q=${encodeURIComponent(query)}`,
  );
  const cities = await response.json();
  return cities;
};

// Get crime data
const getCrimeData = async (cityName: string) => {
  const response = await fetch(
    `/api/crime-data?city=${encodeURIComponent(cityName)}`,
  );
  const data = await response.json();
  return data;
};

// Save location (requires authentication)
const saveLocation = async (cityId: string, safetyScore: number) => {
  const response = await fetch('/api/save-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityId, safetyScore }),
  });
  const data = await response.json();
  return data;
};
```

### TypeScript Types

Import types from `lib/types.ts`:

```typescript
import { City, CrimeData, SavedLocation } from '@/lib/types';
```

---

## Webhooks

**Current**: Not implemented

**Future**: Consider webhooks for:

- New crime data notifications
- Safety score updates
- User activity events

---

## Versioning

**Current Version**: v1 (no version prefix in URL)

**Future**: Consider API versioning:

- `/api/v1/city-search`
- `/api/v2/city-search`

---

## CORS

**Allowed Origins**: Same-origin only

**Production**: Configure for your domain

---

## Testing

### Example cURL Requests

**Search Cities**:

```bash
curl "http://localhost:3000/api/city-search?q=boston"
```

**Get Crime Data**:

```bash
curl "http://localhost:3000/api/crime-data?city=Cambridge"
```

**Calculate Safety Score**:

```bash
curl -X POST "http://localhost:3000/api/safety-score" \
  -H "Content-Type: application/json" \
  -d '{"violentCrimes":180,"propertyCrimes":1800,"population":118403}'
```

---

## Support

For API issues or questions:

- Check the main README.md
- Review error messages
- Verify authentication status
- Check environment variables

---

**API Version**: 1.0  
**Last Updated**: March 8, 2026
