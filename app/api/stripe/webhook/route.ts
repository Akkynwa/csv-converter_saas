import Stripe from 'stripe';
import { NextResponse, NextRequest } from 'next/server';
import { stripe, handleSubscriptionChange } from '@/lib/payments/stripe';
import { createClient } from '@/lib/supabase/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createClient();

  // Handle different Stripe events
  switch (event.type) {
    // 1. Initial Purchase Success
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id; // Pass this from the frontend checkout

      if (userId) {
        await supabase
          .from('profiles')
          .update({ is_pro: true, stripe_customer_id: session.customer })
          .eq('id', userId);
        console.log(`User ${userId} upgraded to Pro.`);
      }
      break;

    // 2. Subscription Changes (Renewals or Upgrades)
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      // This function should be defined in your lib/payments/stripe.ts
      await handleSubscriptionChange(subscription);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}