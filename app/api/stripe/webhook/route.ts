import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { handleSubscriptionChange } from '@/lib/payments/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  // 1. Get the raw body as text for signature verification
  const payload = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!signature || !secret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  // 2. Verify Paystack Signature using HMAC SHA512
  const hash = crypto
    .createHmac('sha512', secret)
    .update(payload)
    .digest('hex');

  if (hash !== signature) {
    console.error('❌ Invalid Paystack Signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(payload);
  const supabase = await createClient();

  // 3. Handle Paystack Events
  try {
    switch (event.event) {
      case 'charge.success':
        // Handle successful initial payment
        const { metadata, customer } = event.data;
        if (metadata?.userId) {
          await supabase
            .from('profiles') // or 'teams' depending on your logic
            .update({ 
              is_pro: true, 
              paystack_customer_code: customer.customer_code 
            })
            .eq('id', metadata.userId);
          
          console.log(`✅ User ${metadata.userId} upgraded to Pro via Paystack.`);
        }
        break;

      case 'subscription.create':
      case 'subscription.disable':
        // Call the function we just added to your lib/payments/stripe.ts
        await handleSubscriptionChange(event.data);
        break;

      default:
        console.log(`ℹ️ Unhandled Paystack event: ${event.event}`);
    }
  } catch (error: any) {
    console.error(`❌ Webhook Handler Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}