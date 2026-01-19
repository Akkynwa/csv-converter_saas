'use server';

import { db } from '@/lib/db/drizzle';
import { conversionHistory, feedback } from '@/lib/db/schema';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function logConversionAction(fileName: string, rowCount: number, format: string) {  const user = await getUser();
  if (!user) return;
// This "pokes" Next.js to refresh the History List immediately
  revalidatePath('/dashboard');
  const team = await getTeamForUser(user.id);
  if (!team) return;


  await db.insert(conversionHistory).values({
    teamId: team.id,
    fileName,
    rowCount,
    format,
  });
}
export async function submitFeedback(message: string, type: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  await db.insert(feedback).values({
    userId: user.id,
    message,
    type,
  });
}