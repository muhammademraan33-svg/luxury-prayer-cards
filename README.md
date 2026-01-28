# Luxury Prayer Cards - E-Commerce Platform

A premium e-commerce platform for memorial and celebration of life cards. Built with React, TypeScript, Tailwind CSS, Supabase, and Stripe.

## Features

- **Card Designer**: Step-by-step creation flow with live preview
- **Photo Editor**: Advanced editing for memorial photos (zoom, crop, pan, rotate, brightness)
- **Memorial Photo Prints**: Large-format prints (16"x20", 18"x24")
- **Funeral Home Portal**: B2B portal with automatic free shipping
- **Admin Dashboard**: Order management and tracking
- **PDF Export**: 300 DPI print-ready PDFs with bleed and crop marks
- **Stripe Integration**: Full checkout and payment processing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

The site is ready for deployment to Vercel, Netlify, or any static hosting service.
