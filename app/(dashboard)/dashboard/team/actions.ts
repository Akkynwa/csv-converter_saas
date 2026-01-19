// app/(dashboard)/dashboard/team/actions.ts
'use server';

import { db } from '@/lib/db/drizzle';
import { teamMembers } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

export async function inviteMemberAction(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const email = formData.get('email') as string;

  // 1. In a real app, you would send an email here via Resend/Postmark
  // 2. Add the user to the team_members table in the DB
  // For now, we assume the user exists or we are creating a 'pending' link
  
  // Logic: Insert into your database
  // await db.insert(teamMembers).values({ ... });

  revalidatePath('/dashboard/team');
  return { success: true };
}

export async function removeMemberAction(formData: FormData) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const memberId = formData.get('memberId') as string;

  // Delete from DB
  await db.delete(teamMembers).where(
    and(
      eq(teamMembers.id, Number(memberId)),
      // Safety: Ensure you don't delete the owner!
    )
  );

  revalidatePath('/dashboard/team');
}