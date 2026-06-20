'use server';

import { db } from '@/lib/db/drizzle';
import { licenseKeys, teams } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getUser, getTeamForUser } from '@/lib/db/queries';

export async function redeemCode(code: string) {
  const user = await getUser();
  if (!user) return { error: 'You must be signed in.' };

  const team = await getTeamForUser(user.id);
  if (!team) return { error: 'No team found for this user.' };

  // 1. Check if the code exists and is not yet redeemed
  const [key] = await db
    .select()
    .from(licenseKeys)
    .where(and(eq(licenseKeys.code, code), eq(licenseKeys.isRedeemed, false)));

  if (!key) {
    return { error: 'Invalid or already redeemed code.' };
  }

  // 2. Transaction: Update the Key and Upgrade the Team
  try {
    await db.transaction(async (tx) => {
      await tx.update(licenseKeys).set({
        isRedeemed: true,
        teamId: team.id,
        activatedBy: user.id,
        redeemedAt: new Date(),
      }).where(eq(licenseKeys.id, key.id));

      await tx.update(teams).set({
        subscriptionStatus: 'active',
        planName: 'AppSumo Lifetime',
      }).where(eq(teams.id, team.id));
    });

    return { success: true };
  } catch (e) {
    return { error: 'Failed to activate. Please try again.' };
  }
}