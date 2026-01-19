// src/app/api/redeem/route.ts
export async function POST(req: Request) {
  const { code } = await req.json();
  const supabase = await createClient(); // your supabase server client
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Check if the code exists and isn't used
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .eq('is_used', false)
    .single();

  if (!promo) return Response.json({ error: "Invalid or used code" }, { status: 400 });

  // 2. Mark code as used and upgrade the user
  await supabase.from('promo_codes').update({ 
    is_used: true, 
    used_by: user.id 
  }).eq('code', code);

  await supabase.from('profiles').update({ 
    plan_type: 'lifetime',
    tier: promo.tier 
  }).eq('id', user.id);

  return Response.json({ success: true });
}