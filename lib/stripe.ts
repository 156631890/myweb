// Stripe configuration placeholder
// In production, you would use the Stripe SDK here

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  // Test mode key for development
  testKey: "pk_test_placeholder",
};

// Stripe checkout session creation would go here
export async function createCheckoutSession(_items: unknown[]) {
  // This would integrate with Stripe in production
  return {
    url: "/checkout/success",
  };
}

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}
