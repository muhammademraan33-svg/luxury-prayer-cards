# Deployment Guide

## Prerequisites

1. **Supabase Account**
   - Create a new project at https://supabase.com
   - Get your project URL and anon key from Settings > API
   - Run the SQL schema from `supabase-schema.sql` in the SQL Editor

2. **Stripe Account**
   - Create a Stripe account at https://stripe.com
   - Get your publishable key from Developers > API keys
   - Set up webhook endpoints for production (optional for demo)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The `dist` folder contains the production build

## Deployment Options

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add environment variables in Netlify dashboard

### Other Static Hosts

Upload the `dist` folder to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- GitHub Pages

## Supabase Setup

1. **Create Tables**: Run `supabase-schema.sql` in Supabase SQL Editor

2. **Configure Authentication**:
   - Enable Email authentication in Authentication > Providers
   - Configure email templates if needed

3. **Storage** (Optional):
   - Create a storage bucket named 'designs'
   - Set it to public if you want public access
   - Configure policies as needed

## Stripe Setup

1. **Test Mode**: Use test keys for development
2. **Production**: Switch to live keys in production
3. **Supabase Edge Functions** (Required for production checkout):
   - Deploy functions:
     - `create-payment-intent`
     - `stripe-webhook`
   - Set function environment variables in Supabase:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - Optional email:
       - `RESEND_API_KEY`
       - `RESEND_FROM`
4. **Webhooks**:
   - Create a Stripe webhook endpoint pointing to your Supabase function URL:
     - `https://<project-ref>.functions.supabase.co/stripe-webhook`
   - Subscribe to events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

## Admin Access

To create an admin user:

1. Register a user through the app
2. In Supabase dashboard, go to Authentication > Users
3. Edit the user's metadata and add:
```json
{
  "user_type": "admin"
}
```

## Notes

- The app works in demo mode without backend API endpoints
- For production, implement backend API for:
  - Payment intent creation
  - Webhook handling
  - Email notifications
  - Order processing
