'use client';

import { useActionState, Suspense } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Save, BadgeCheck, Sparkles, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { updateAccount } from '@/app/(login)/actions';
import { User as UserType } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

// --- SUB-COMPONENT: FORM FIELDS ---
function AccountForm({ state, nameValue = '', emailValue = '' }: AccountFormProps) {
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

// --- DATA WRAPPER ---
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
    <section className="flex-1 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          Profile Settings
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Update your personal information and how you appear on the platform.
        </p>
      </div>

      {/* Main Card */}
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
                Account Identification
              </CardTitle>
            </div>
            <Sparkles className="w-5 h-5 text-orange-200" />
          </CardHeader>
          
          <CardContent className="p-8">
            <form className="space-y-8" action={formAction}>
              <Suspense 
                fallback={
                  <div className="space-y-6 animate-pulse">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="h-12 bg-gray-100 rounded-2xl" />
                      <div className="h-12 bg-gray-100 rounded-2xl" />
                    </div>
                  </div>
                }
              >
                <AccountFormWithData state={state} />
              </Suspense>

              {/* Status Messages */}
              <div className="min-h-[20px]">
                {state.error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    {state.error}
                  </motion.p>
                )}
                {state.success && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 text-xs font-bold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    {state.success}
                  </motion.p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <Button
                  type="submit"
                  className="rounded-2xl h-12 px-10 bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all active:scale-95 shadow-lg shadow-orange-200"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Apply Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Decorative Help Box */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
        className="p-6 rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm mb-1 text-orange-400 uppercase tracking-widest">Privacy Tip</h4>
            <p className="text-gray-400 text-xs max-w-md">Your email is used for security alerts and billing notifications. Ensure it is a valid address to prevent account lockout.</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
      </motion.div>
    </section>
  );
}