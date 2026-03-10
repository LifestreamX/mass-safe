# Deployment Guide - MassSafe

This guide will help you deploy MassSafe to Vercel for free.

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- CockroachDB account with a serverless cluster
- Google OAuth credentials
- Mapbox token

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Configure Environment Variables

In Vercel project settings, add these environment variables:

**Database**

```
DATABASE_URL=postgresql://user:password@host:26257/masssafe?sslmode=require
```

**NextAuth**

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret
```

**Google OAuth**

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Mapbox**

```
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-public-token
```

**FBI API (Optional)**

```
FBI_API_KEY=your-fbi-api-key
```

### 4. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to Credentials
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### 5. Deploy

Click "Deploy" in Vercel. Vercel will:

- Install dependencies
- Run `prisma generate`
- Build the Next.js app
- Deploy to production

### 6. Set Up Database

After first deployment, you need to seed the database:

**Option A: Use Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npm run db:push
npm run db:seed
```

**Option B: Use Prisma Studio Locally**

```bash
# Pull production env variables
vercel env pull .env.local

# Push schema
npx prisma db push

# Seed database
npm run db:seed
```

### 7. Verify Deployment

Visit your deployed URL: `https://your-app-name.vercel.app`

Test:

- Search functionality
- City detail pages
- Google OAuth login
- Map rendering
- Save locations feature

## Post-Deployment

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records
5. Update `NEXTAUTH_URL` environment variable
6. Update Google OAuth redirect URI

### Monitoring

Vercel provides:

- Automatic HTTPS
- Global CDN
- Analytics
- Error tracking
- Performance insights

### Continuous Deployment

Every push to `main` branch will:

- Trigger automatic deployment
- Run build checks
- Deploy if successful

## Environment-Specific Variables

### Development

```env
NEXTAUTH_URL=http://localhost:3000
```

### Production

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
```

Make sure to update both:

1. Vercel environment variables
2. Google OAuth redirect URIs

## Troubleshooting

### Build Fails

**Prisma Client Error**

- Ensure `postinstall` script runs `prisma generate`
- Check DATABASE_URL is set in Vercel

**TypeScript Errors**

- Run `npm run lint` locally first
- Fix all TypeScript errors before deploying

### Runtime Errors

**Database Connection**

- Verify DATABASE_URL format
- Check CockroachDB cluster is running
- Ensure connection string has `?sslmode=require`

**Authentication Not Working**

- Verify NEXTAUTH_URL matches deployment URL
- Check Google OAuth redirect URI
- Ensure NEXTAUTH_SECRET is set

**Map Not Loading**

- Verify NEXT_PUBLIC_MAPBOX_TOKEN is set
- Check token is public (starts with 'pk.')
- Ensure Mapbox account is active

## Cost Optimization

MassSafe is designed to run on free tiers:

- **Vercel**: Free for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless functions included

- **CockroachDB**: Free serverless tier
  - 5GB storage
  - 250M RUs/month

- **Mapbox**: Free tier
  - 50,000 map loads/month

- **Google OAuth**: Free
  - Unlimited authentications

- **FBI API**: Free (or use mock data)

## Performance Tips

1. **Enable Vercel Analytics**
   - Add `@vercel/analytics` package
   - Monitor real user metrics

2. **Use Edge Runtime** (Future Enhancement)
   - Move API routes to Edge Runtime for faster response

3. **Image Optimization**
   - Use Next.js Image component
   - Optimize user profile images

4. **Caching Strategy**
   - Crime data cached for 30 days
   - City data cached indefinitely
   - API responses use proper cache headers

## Maintenance

### Update Dependencies

```bash
npm outdated
npm update
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Deploy migration
npx prisma migrate deploy
```

### Monitor Logs

- Use Vercel dashboard for error logs
- Set up error tracking (Sentry, LogRocket)
- Monitor API usage and quotas

## Security Checklist

- ✅ Environment variables secured in Vercel
- ✅ OAuth credentials not in code
- ✅ Database credentials encrypted
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Protected routes use middleware
- ✅ API routes validate authentication

## Scaling

If your app grows beyond free tiers:

1. **Vercel Pro** ($20/month)
   - Increased bandwidth
   - Team collaboration
   - Advanced analytics

2. **CockroachDB Dedicated**
   - Scalable pricing
   - Enhanced performance
   - Backup and recovery

3. **Mapbox Pay-As-You-Go**
   - $5 per 1,000 map loads after free tier

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

**Need help?** Check the main README.md or create an issue on GitHub.
