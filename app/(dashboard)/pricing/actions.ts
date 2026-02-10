'use server';

import { redirect } from 'next/navigation';
import { getTeamForUser, getUser } from '@/lib/db/queries';

export async function handlePaystackCheckout(formData: FormData) {
  // 1. Authenticate the User
  const user = await getUser();
  if (!user) {
    redirect('/sign-up?redirect=pricing');
  }

  // 2. Identify the Team
  const team = await getTeamForUser(user.id);
  if (!team) {
    // If no team, they shouldn't be on the pricing page yet
    redirect('/dashboard');
  }

  const priceId = formData.get('priceId') as string;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  // 3. Determine Amount (Paystack expects Kobo as a number or string)
  // Ensure your .env keys match these exactly
  const isPlusPlan = priceId === process.env.PAYSTACK_PRICE_ID_PLUS;
  const amount = isPlusPlan ? "2500000" : "1000000"; // ₦25,000 or ₦10,000

  // 4. Initialize Transaction
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount,
        plan: priceId,
        callback_url: `${baseUrl}/api/paystack/callback`,
        metadata: {
          teamId: team.id,
          userId: user.id,
          planName: isPlusPlan ? 'Plus' : 'Base'
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack Initialization Error:', data.message);
      // We redirect back to pricing with an error param instead of crashing
      redirect(`/pricing?error=${encodeURIComponent(data.message)}`);
    }

    // 5. Success: Send user to Paystack
    redirect(data.data.authorization_url);
  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error; // Let Next.js handle the redirect
    }
    console.error('Network or Parsing Error:', error);
    redirect('/pricing?error=system_error');
  }
}