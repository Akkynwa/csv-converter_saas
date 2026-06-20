import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { mappingTemplates } from '@/lib/db/schema';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 0 });
    }

    const team = await getTeamForUser(user.id);
    if (!team) {
      return NextResponse.json([]);
    }

    // Fetch templates ordered by most recent
    const templates = await db
      .select()
      .from(mappingTemplates)
      .where(eq(mappingTemplates.teamId, team.id))
      .orderBy(desc(mappingTemplates.createdAt));

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}