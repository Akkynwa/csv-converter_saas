import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  
  // 1. Verify Webhook Signature (Security)
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== request.headers.get('x-paystack-signature')) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle successful payment
  if (event.event === 'charge.success') {
    const { metadata, plan } = event.data;

    await db
      .update(teams)
      .set({
        subscriptionStatus: 'active',
        stripeSubscriptionId: event.data.reference,
        stripeProductId: plan?.plan_code || null,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, Number(metadata.teamId)));
  }

  return new Response('OK', { status: 200 });
}