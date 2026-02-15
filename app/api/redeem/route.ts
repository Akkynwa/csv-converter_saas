import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    const supabase = await createClient();

    // 1. Get the current user and check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if the code exists and isn't used
    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .single();

    if (promoError || !promo) {
      return NextResponse.json({ error: "Invalid or used code" }, { status: 400 });
    }

    // 3. Mark code as used and upgrade the user (Transaction-like flow)
    const { error: updatePromoError } = await supabase
      .from('promo_codes')
      .update({ 
        is_used: true, 
        used_by: user.id 
      })
      .eq('code', code);

    if (updatePromoError) throw updatePromoError;

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ 
        plan_type: 'lifetime',
        tier: promo.tier 
      })
      .eq('id', user.id);

    if (updateProfileError) throw updateProfileError;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Redeem Error:', error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}