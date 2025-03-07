# Deployment Guide for PhotoSlide

## Prerequisites

- PostgreSQL database server
- Node.js 18 or later
- Production server or cloud platform (e.g., Vercel, Railway, or similar)

## Environment Setup

1. Set up your production database:
   - Create a new PostgreSQL database for production
   - Note down the database credentials

2. Configure environment variables:
   - Set `POSTGRES_PASSWORD` - Your database password
   - Set `POSTGRES_HOST` - Your database host
   - Set `NEXT_PUBLIC_API_URL` - Your production domain

## Deployment Steps

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Recommended Platforms

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Railway
1. Create new project
2. Add PostgreSQL plugin
3. Configure environment variables
4. Deploy from GitHub

## Post-Deployment

1. Verify database connections
2. Test image upload functionality
3. Check slideshow performance
4. Monitor error logs

## Production Considerations

- Enable production logging
- Set up monitoring
- Configure backup strategy for database
- Implement rate limiting if needed
- Set up SSL/TLS certificates