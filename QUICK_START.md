# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

**Get Supabase Credentials:**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key

**Get Stripe Credentials:**
1. Go to https://stripe.com
2. Sign up or log in
3. Go to Developers > API keys
4. Copy the Publishable key (use test key for development)

### Step 3: Set Up Database

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create tables and policies

### Step 4: Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## 🎯 Test the Features

### Test Card Designer
1. Go to `/design`
2. Follow the 6-step process
3. Upload a photo and edit it
4. Add borders, prayers, and text
5. Export to PDF
6. Add to cart

### Test Funeral Home Portal
1. Go to `/funeral-home`
2. Register a new account
3. Login
4. Notice free shipping is applied
5. Create an order

### Test Admin Dashboard
1. Create a user account
2. In Supabase, edit the user's metadata:
   ```json
   {
     "user_type": "admin"
   }
   ```
3. Go to `/admin`
4. View and manage orders

### Test Memorial Photo Editor
1. Go to `/memorial-photo-editor`
2. Upload a photo
3. Adjust zoom, rotation, brightness
4. Add text overlay
5. Export PDF or add to cart

## 📦 Build for Production

```bash
npm run build
```

The `dist` folder contains your production build.

## 🚢 Deploy

### Deploy to Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

Don't forget to add your environment variables in the deployment platform!

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to customize the color scheme.

### Add More Prayers
Edit `src/components/Designer/PrayerSelector.tsx` and add to the `prayers` array.

### Add More Fonts
1. Add font link in `index.html`
2. Add font class in `tailwind.config.js`
3. Add option in `src/pages/DesignerPage.tsx`

## 🐛 Troubleshooting

**Issue: Supabase connection error**
- Check your `.env` file has correct credentials
- Verify Supabase project is active

**Issue: Stripe not working**
- Make sure you're using test keys in development
- Check browser console for errors

**Issue: PDF export not working**
- Ensure all dependencies are installed
- Check browser console for errors

**Issue: Images not uploading**
- Check file size (should be under 10MB for demo)
- Verify image format (JPG, PNG supported)

## 📚 Next Steps

1. Read `DEPLOYMENT.md` for detailed deployment instructions
2. Read `PROJECT_SUMMARY.md` for feature overview
3. Customize the design to match your brand
4. Set up production Stripe account
5. Configure email notifications
6. Add analytics

## 💡 Tips

- Use test mode for Stripe during development
- Test all user flows before deploying
- Set up proper error monitoring in production
- Consider adding analytics for user behavior
- Implement proper SEO meta tags
- Add social media sharing

Happy coding! 🎉
