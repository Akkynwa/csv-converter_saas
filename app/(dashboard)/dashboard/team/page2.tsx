'use client';

import { useState, useActionState, Suspense } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  PlusCircle, 
  UserMinus, 
  ShieldCheck, 
  Mail, 
  Zap, 
  CreditCard 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { customerPortalAction } from '@/lib/payments/actions';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { removeTeamMember, inviteTeamMember } from '@/app/(login)/actions';

type ActionState = { error?: string; success?: string; };
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// --- SKELETONS (Polished) ---
function SectionSkeleton() {
  return (
    <Card className="mb-8 border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm animate-pulse">
      <div className="h-[140px]" />
    </Card>
  );
}

// --- MANAGE SUBSCRIPTION ---
function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="mb-8 border-gray-100 shadow-sm bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
            <CreditCard className="w-4 h-4 text-orange-600" />
            Billing Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <Zap className="w-6 h-6 text-orange-600 fill-orange-600" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 leading-tight">
                  {teamData?.planName || 'Free Tier'}
                </p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {teamData?.subscriptionStatus === 'active' ? 'Billed Monthly' : 'Limited Access'}
                </p>
              </div>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline" className="rounded-xl font-bold border-gray-200 hover:bg-orange-50 hover:text-orange-600 transition-all">
                Portal Settings
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- TEAM MEMBERS ---
function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<ActionState, FormData>(removeTeamMember, {});

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => user.name || user.email || 'Unknown User';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <Card className="mb-8 border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-[2rem] overflow-hidden">
        <CardHeader className="border-b border-gray-50">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            Active Seats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-50">
            {teamData?.teamMembers?.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
  {/* ✅ Just use Fallback until you add an 'image' column to your Drizzle schema */}
  <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xs">
    {getUserDisplayName(member.user).split(' ').map(n => n[0]).join('')}
  </AvatarFallback>
</Avatar>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{getUserDisplayName(member.user)}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.role}</p>
                  </div>
                </div>
                {index > 0 && (
                  <form action={removeAction}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <Button type="submit" variant="ghost" size="sm" disabled={isRemovePending} className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-bold">
                      {isRemovePending ? <Loader2 className="animate-spin h-4 w-4" /> : <UserMinus className="h-4 w-4" />}
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- INVITE TEAM MEMBER ---
function InviteTeamMember() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const isOwner = user?.role === 'owner';
  const [inviteState, inviteAction, isInvitePending] = useActionState<ActionState, FormData>(inviteTeamMember, {});

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="border-none bg-gray-900 text-white shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter text-orange-400">
            <Mail className="w-4 h-4" />
            Grow Your Team
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          <form action={inviteAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Email Address</Label>
              <div className="relative">
                <Input id="email" name="email" type="email" placeholder="teammate@company.com" required disabled={!isOwner} 
                  className="bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:ring-orange-500 transition-all placeholder:text-gray-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">Access Level</Label>
              <RadioGroup defaultValue="member" name="role" className="flex gap-4" disabled={!isOwner}>
                {['member', 'owner'].map((role) => (
                  <div key={role} className="flex-1">
                    <RadioGroupItem value={role} id={role} className="sr-only" />
                    <Label htmlFor={role} className={cn(
                      "flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all font-bold text-xs uppercase tracking-tighter",
                      "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400",
                      "peer-aria-checked:border-orange-500 peer-aria-checked:bg-orange-500/10 peer-aria-checked:text-orange-500"
                    )}>
                      {role}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white h-12 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-transform active:scale-95 shadow-lg shadow-orange-900/20" disabled={isInvitePending || !isOwner}>
              {isInvitePending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Send Invitation
            </Button>
          </form>
        </CardContent>
        {!isOwner && (
          <CardFooter className="bg-black/20 p-4 justify-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Restricted: Team Owners Only
            </p>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

export default function SettingsPage() {
  return (
    <section className="flex-1 max-w-4xl mx-auto space-y-2">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Team Management</h1>
        <p className="text-gray-500 font-medium mt-1">Control access, billing, and member roles.</p>
      </div>

      <Suspense fallback={<SectionSkeleton />}>
        <ManageSubscription />
      </Suspense>
      
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <Suspense fallback={<SectionSkeleton />}>
            <TeamMembers />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<SectionSkeleton />}>
            <InviteTeamMember />
          </Suspense>
        </div>
      </div>
    </section>
  );
}