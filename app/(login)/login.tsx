'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-orange-50 via-white to-orange-50/30">
      
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-[1.5rem] shadow-xl shadow-orange-100 border border-orange-50">
            <CircleIcon className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter">
          {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          {mode === 'signin' 
            ? 'Enter your credentials to access your dashboard' 
            : 'Join thousands of users converting CSVs today'}
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="sm:mx-auto sm:w-full sm:max-w-[440px]"
      >
        <div className="bg-white/70 backdrop-blur-xl py-10 px-8 shadow-2xl shadow-orange-100/50 rounded-[2.5rem] border border-white">
          <form className="space-y-5" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  placeholder="name@company.com"
                  className="pl-11 rounded-2xl h-12 border-gray-100 bg-white/50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                  Password
                </Label>
                {mode === 'signin' && (
                  <Link href="#" className="text-[10px] font-bold text-orange-600 hover:text-orange-500 uppercase tracking-tighter">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  defaultValue={state.password}
                  required
                  placeholder="••••••••"
                  className="pl-11 rounded-2xl h-12 border-gray-100 bg-white/50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {state?.error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold p-3 rounded-xl flex items-center gap-2"
              >
                <div className="h-1 w-1 rounded-full bg-rose-500" />
                {state.error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium mb-4">
              {mode === 'signin' ? "New to CSV Pro?" : "Already have an account?"}
            </p>
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all active:scale-95"
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="fixed -z-10 top-1/4 -right-20 w-96 h-96 bg-orange-200/20 rounded-full blur-[120px]" />
      <div className="fixed -z-10 bottom-1/4 -left-20 w-80 h-80 bg-rose-200/20 rounded-full blur-[100px]" />
    </div>
  );
}