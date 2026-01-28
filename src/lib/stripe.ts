import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

// Only load Stripe if we have a valid key, otherwise return null
export const stripePromise: Promise<Stripe | null> = stripePublishableKey && stripePublishableKey !== ''
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null)
