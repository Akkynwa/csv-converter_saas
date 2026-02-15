'use client';

import { useActionState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Trash2, Loader2, ShieldAlert, KeyRound, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { updatePassword, deleteAccount } from '@/app/(login)/actions';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<PasswordState, FormData>(updatePassword, {});
  const [deleteState, deleteAction, isDeletePending] = useActionState<DeleteState, FormData>(deleteAccount, {});

  return (
    <section className="flex-1 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          Privacy & Security
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage your credentials and account data settings.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Password Update Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30 px-8 py-6">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                <KeyRound className="w-4 h-4 text-orange-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-6 max-w-md" action={passwordAction}>
                <div className="space-y-2">
                  <Label htmlFor="current-password text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                    defaultValue={passwordState.currentPassword}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                      defaultValue={passwordState.newPassword}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                      defaultValue={passwordState.confirmPassword}
                    />
                  </div>
                </div>

                {passwordState.error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> {passwordState.error}
                  </motion.p>
                )}
                {passwordState.success && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 text-xs font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    {passwordState.success}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="rounded-2xl h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all active:scale-95"
                  disabled={isPasswordPending}
                >
                  {isPasswordPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Lock className="mr-2 h-4 w-4" /> Update Password</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account Card (Danger Zone) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-rose-100 shadow-sm bg-rose-50/20 rounded-[2rem] overflow-hidden">
            <CardHeader className="border-b border-rose-100/50 bg-rose-50/50 px-8 py-6">
              <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter text-rose-600">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-500 font-medium">
                    This action is permanent and will immediately delete all your CSV conversion history, team data, and subscription settings.
                  </p>
                </div>
                
                <form action={deleteAction} className="flex flex-col gap-3 min-w-[240px]">
                  <Input
                    name="password"
                    type="password"
                    placeholder="Confirm with password"
                    required
                    className="rounded-xl border-rose-200 bg-white focus:ring-rose-500"
                    defaultValue={deleteState.password}
                  />
                  {deleteState.error && (
                    <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest">{deleteState.error}</p>
                  )}<Button
  type="submit"
  variant="outline" // ✅ This is an allowed type
  className="rounded-xl font-bold h-11 shadow-lg shadow-rose-200 bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
  disabled={isDeletePending}
>
                    {isDeletePending ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <><Trash2 className="mr-2 h-4 w-4" /> Terminate Account</>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}