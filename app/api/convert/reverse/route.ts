import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { processedData } from '@/lib/db/schema';
import { getUser, getTeamForUser } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const user = await getUser();
  
  // 1. Authentication Check
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const batchId = searchParams.get('batchId');

  if (!batchId) {
    return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
  }

  try {
    // 2. Authorization Check (Ensure the user belongs to the team owning this data)
    const team = await getTeamForUser(user.id);
    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 403 });
    }

    // 3. Fetch the data strictly by batchId AND teamId for security
    const results = await db
      .select()
      .from(processedData)
      .where(
        and(
          eq(processedData.batchId, batchId),
          eq(processedData.teamId, team.id)
        )
      );

    if (results.length === 0) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    // 4. Return the rowData (JSON) stored during the initial conversion
    // We return the first match since batchId should be unique per upload
    return NextResponse.json({
      fileName: results[0].fileName,
      rowData: results[0].rowData,
    });

  } catch (error) {
    console.error('Reverse conversion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}