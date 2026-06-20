'use server';

import { db } from '@/lib/db/drizzle';
import { mappingTemplates } from '@/lib/db/schema';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';

export async function saveTemplate(name: string, mapping: Record<string, string>) {
  const user = await getUser();
  const team = await getTeamForUser(user?.id!);

  if (!team) return { error: 'Unauthorized' };

  try {
    await db.insert(mappingTemplates).values({
      name,
      teamId: team.id,
      mapping,
    });
    
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to save template' };
  }
}