import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Check "Pro" Status (The SaaS Paywall)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', user.id)
      .single();

    if (!profile?.is_pro) {
      return NextResponse.json({ error: "Please upgrade to use this feature" }, { status: 403 });
    }

    // 3. Process the File
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const csvString = await file.text();
    const parsedData = Papa.parse(csvString, { header: true, skipEmptyLines: true });

    // 4. Log Usage in Database
    await supabase.from('conversions').insert({
      user_id: user.id,
      file_name: file.name,
      row_count: parsedData.data.length
    });

    // 5. Return the actual data to the user
    return NextResponse.json({ 
      data: parsedData.data,
      count: parsedData.data.length 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}