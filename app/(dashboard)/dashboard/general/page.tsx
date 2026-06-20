'use client';

import { useActionState, Suspense, useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { 
  Loader2, User, Mail, Save, BadgeCheck, 
  Sparkles, ShieldCheck, Ticket, CreditCard 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { updateAccount } from '@/app/(login)/actions';
import { User as UserType } from '@/lib/db/schema';
import { redeemCode } from '@/lib/actions/redeem'; // Ensure this action exists
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

// --- SUB-COMPONENT: REDEEM CODE FORM ---
function AppSumoRedeemCard() {
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setIsRedeeming(true);
    const result = await redeemCode(code);
    
    if (result.success) {
      toast.success('Lifetime Access Activated!', {
        description: 'Your account has been upgraded to AppSumo Pro.'
      });
      setCode('');
      // Optional: window.location.reload() to refresh team status
    } else {
      toast.error(result.error || 'Invalid code');
    }
    setIsRedeeming(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.2 }}
    >
      <Card className="border-orange-100 shadow-xl shadow-orange-900/5 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-orange-50 bg-orange-50/30 px-8 py-8 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter text-orange-600">
              <Ticket className="w-4 h-4" />
              AppSumo Redemption
            </CardTitle>
          </div>
          <CreditCard className="w-5 h-5 text-orange-200" />
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                License Key
              </Label>
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  placeholder="e.g., PRO-SUMO-XXXX"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 font-mono uppercase tracking-wider focus:bg-white"
                />
                <Button 
                  type="submit" 
                  disabled={isRedeeming || !code}
                  className="rounded-2xl h-12 px-8 bg-gray-900 hover:bg-black text-white font-bold"
                >
                  {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Plan'}
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium ml-1">
                Purchased a lifetime deal? Enter your code to upgrade your workspace instantly.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- SUB-COMPONENT: ACCOUNT FORM ---
function AccountForm({ state, nameValue = '', emailValue = '' }: { state: ActionState; nameValue?: string; emailValue?: string }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Display Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              defaultValue={state.name || nameValue}
              required
              className="pl-11 rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              defaultValue={emailValue}
              required
              className="pl-11 rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { data: user } = useSWR<UserType>('/api/user', fetcher);
  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
    />
  );
}

// --- MAIN PAGE ---
export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <section className="flex-1 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 lg:p-0">
      {/* Page Header */}
      <div className="flex flex-col mt-8 lg:mt-0">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          Workspace <span className="text-orange-600">Settings</span>
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage your identity and subscription license keys.
        </p>
      </div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardHeader className="border-b border-gray-50 bg-gray-50/30 px-8 py-8 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                <BadgeCheck className="w-4 h-4 text-orange-600" />
                Identity & Contact
              </CardTitle>
            </div>
            <Sparkles className="w-5 h-5 text-orange-200" />
          </CardHeader>
          
          <CardContent className="p-8">
            <form className="space-y-8" action={formAction}>
              <Suspense fallback={<div className="h-24 bg-gray-100 animate-pulse rounded-2xl" />}>
                <AccountFormWithData state={state} />
              </Suspense>

              {state.error && (
                <p className="text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100">
                  {state.error}
                </p>
              )}
              {state.success && (
                <p className="text-emerald-600 text-xs font-bold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  {state.success}
                </p>
              )}

              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <Button
                  type="submit"
                  className="rounded-2xl h-12 px-10 bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-200"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* AppSumo Section */}
      <AppSumoRedeemCard />

      {/* Privacy Box */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="p-6 rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-md">
            <h4 className="font-bold text-sm mb-1 text-orange-400 uppercase tracking-widest">Enterprise Security</h4>
            <p className="text-gray-400 text-xs">Your data is encrypted at rest. Changing your email will trigger a security notification to your previous address.</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-orange-500 opacity-50" />
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
      </motion.div>
    </section>
  );
}