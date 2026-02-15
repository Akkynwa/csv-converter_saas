import { NextResponse } from 'next/server';
import { getTeamForUser } from '@/lib/db/queries';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // 1. Initialize Supabase and check for a session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch team data using the authenticated user's ID
// Convert the string ID from Supabase to a number for your DB query
const team = await getTeamForUser(Number(user.id));
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // 3. Return the data using NextResponse
    return NextResponse.json(team);

  } catch (error: any) {
    console.error('API Team Error:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}