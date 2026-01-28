# Troubleshooting Guide

## Blank Page Issue - FIXED ✅

### Problem
The app was showing a blank page when running `npm run dev`.

### Root Cause
The Stripe Elements component was trying to initialize with an empty string when environment variables were not set, causing a runtime error.

### Solution Applied
1. ✅ Added error boundary to catch and display errors
2. ✅ Made Stripe initialization conditional - only loads if key is provided
3. ✅ App now works in demo mode without Stripe/Supabase keys
4. ✅ Added console logging for debugging

### How to Verify It's Fixed

1. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for the message: "🚀 Luxury Prayer Cards - App Starting..."
   - Check for any red error messages

2. **If Still Blank:**
   - Check the browser console for specific errors
   - The error boundary should now display errors instead of blank page
   - Verify the root element exists in `index.html`

### Current Status

✅ **App should now load even without environment variables**
✅ **Error boundary will catch and display any errors**
✅ **Stripe only initializes if key is provided**

### Next Steps

1. **Restart the dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Check the browser:**
   - Open http://localhost:5173
   - You should see the homepage
   - Check browser console (F12) for any errors

3. **If you see errors in the console:**
   - Copy the error message
   - The error boundary should display it on screen
   - Share the error for further debugging

### Environment Variables (Optional for Demo)

The app now works without these, but you'll need them for full functionality:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_STRIPE_PUBLISHABLE_KEY=your_key
```

### Common Issues

**Issue:** Still seeing blank page
- **Solution:** Check browser console (F12) and look for JavaScript errors
- The error boundary should now show errors on screen

**Issue:** "Root element not found"
- **Solution:** Verify `index.html` has `<div id="root"></div>`

**Issue:** CORS errors
- **Solution:** This is normal if Supabase URL is not set - app works in demo mode

**Issue:** Stripe errors
- **Solution:** App now skips Stripe if no key is provided - this is expected

---

*Last Updated: After fixing blank page issue*
