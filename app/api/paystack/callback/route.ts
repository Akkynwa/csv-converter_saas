import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { teams, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { setSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(new URL('/pricing?error=no_reference', request.url));
  }

  try {
    // 1. Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await response.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.redirect(new URL('/pricing?error=payment_failed', request.url));
    }

    const { metadata, plan, customer } = verifyData.data;
    const teamId = metadata?.teamId;
    const userId = metadata?.userId;

    // 2. Update the Team in DB
    // We map Paystack's 'plan' to 'stripeProductId' to avoid changing the schema
    await db
      .update(teams)
      .set({
        subscriptionStatus: 'active',
        stripeSubscriptionId: reference, // Using reference as a unique pointer
        stripeProductId: plan, 
        planName: metadata?.planName || 'Pro Plan',
        updatedAt: new Date(),
      })
      .where(eq(teams.id, Number(teamId)));

    // 3. Refresh the User Session
    const [user] = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
    if (user) {
      await setSession(user);
    }

    // 4. Send them to the dashboard
    return NextResponse.redirect(new URL('/dashboard?payment=success', request.url));

  } catch (error) {
    console.error('Callback Error:', error);
    return NextResponse.redirect(new URL('/pricing?error=verification_error', request.url));
  }
}