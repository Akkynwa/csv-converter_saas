import { redirect } from 'next/navigation';
import { Team } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { createClient } from '@/lib/supabase/server';

// 1. Export a "stripe" mock so your webhook/other files don't break during import
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
      plan: priceId, // Paystack Plan Code
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paystack/callback`,
      metadata: {
        teamId: team.id,
        userId: user.id,
      },
    }),
  });

  const resData = await response.json();

  if (!resData.status) {
    console.error('Paystack Error:', resData.message);
    throw new Error(resData.message || 'Could not initialize Paystack payment');
  }

  redirect(resData.data.authorization_url);
}

// 2. The missing function the build was asking for
export async function handleSubscriptionChange(payload: any) {
  const supabase = await createClient();
  
  // Paystack webhooks send data in a different format than Stripe
  // Assuming payload is the 'data' object from Paystack webhook
  const customerEmail = payload.customer.email;
  const planCode = payload.plan.plan_code;
  const status = payload.status; // e.g., 'active'

  const isPro = status === 'active';

  const { error } = await supabase
    .from('teams')
    .update({ 
      plan_name: isPro ? 'pro' : 'free',
      subscription_status: status 
    })
    .filter('metadata->>email', 'eq', customerEmail); // Adjust based on how you store team info

  if (error) console.error('Error updating Paystack subscription:', error);
}

export async function createCustomerPortalSession(team: Team) {
  redirect('/dashboard/billing');
}

export async function getStripePrices() { return []; }
export async function getStripeProducts() { return []; }