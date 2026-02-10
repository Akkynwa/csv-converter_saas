'use server';

import { redirect } from 'next/navigation';
import { withTeam } from '@/lib/auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;

  // 1. Initialize Paystack Transaction
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: team.teamMembers[0]?.user.email, // Using the team owner's email
      // Amount in Kobo: PLN_jrledmcu6b85lpe = 10k, PLN_hkt7pvpnn3lyb4b = 25k
      amount: priceId === process.env.PAYSTACK_PRICE_ID_PLUS ? "2500000" : "1000000",
      plan: priceId,
      callback_url: `${process.env.BASE_URL}/api/paystack/callback`,
      metadata: {
        teamId: team.id,
      },
    }),
  });

  const data = await response.json();

  if (!data.status) {
    console.error('Paystack Error:', data.message);
    throw new Error('Failed to initialize payment');
  }

  // 2. Redirect to Paystack secure checkout
  redirect(data.data.authorization_url);
});

export const customerPortalAction = withTeam(async (_, team) => {
  // Paystack doesn't have a "one-click" portal link like Stripe. 
  // For now, redirect them to the dashboard or a custom billing page.
  // Most Nigerian SaaS users manage subs via their unique dashboard.
  redirect('/dashboard/billing');
});