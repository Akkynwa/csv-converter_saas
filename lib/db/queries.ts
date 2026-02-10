import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) return null;

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'number') return null;

  if (new Date(sessionData.expires) < new Date()) return null;

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}

// Replaces getTeamByStripeCustomerId for the Paystack flow
export async function getTeamByPaystackReference(reference: string) {
  const result = await db
    .select()
    .from(teams)
    // Using stripeSubscriptionId to store Paystack reference to avoid DB migration
    .where(eq(teams.stripeSubscriptionId, reference)) 
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// Added this back as a bridge so other parts of the app don't crash
export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    paystackSubscriptionId: string | null;
    paystackPlanCode: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      // Mapping Paystack data to existing schema columns
      stripeSubscriptionId: subscriptionData.paystackSubscriptionId,
      stripeProductId: subscriptionData.paystackPlanCode,
      planName: subscriptionData.planName,
      subscriptionStatus: subscriptionData.subscriptionStatus,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

export async function getTeamMembers(userId: number) {
  const userTeam = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  if (userTeam.length === 0) return [];

  return await db
    .select({
      id: teamMembers.id,
      role: teamMembers.role,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, userTeam[0].teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) throw new Error('User not authenticated');

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, userId),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: { id: true, name: true, email: true }
              }
            }
          }
        }
      }
    }
  });

  return result?.team || null;
}