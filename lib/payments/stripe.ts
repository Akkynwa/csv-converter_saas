import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';

// We leave these empty or mock them so the Stripe library doesn't crash Turbopack
export const stripe = null; 

export async function createCheckoutSession({
  team,
  priceId
}: {
  team: Team | null;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  // Paystack expects amount in Kobo (Naira * 100)
  const amount = priceId === process.env.PAYSTACK_PRICE_ID_PLUS ? 2500000 : 1000000;

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: amount.toString(),
      plan: priceId,
      callback_url: `${process.env.BASE_URL}/api/paystack/callback`,
      metadata: {
        teamId: team.id,
        userId: user.id,
      },
    }),
  });

  const resData = await response.json();

  if (!resData.status) {
    console.error('Paystack Error:', resData.message);
    throw new Error('Could not initialize Paystack payment');
  }

  redirect(resData.data.authorization_url);
}

// Paystack doesn't have a pre-built portal like Stripe, 
// so we redirect to your internal billing page.
export async function createCustomerPortalSession(team: Team) {
  redirect('/dashboard/billing');
}

// Mock these functions so your Pricing Page doesn't crash during the transition
export async function getStripePrices() {
  return [];
}

export async function getStripeProducts() {
  return [];
}