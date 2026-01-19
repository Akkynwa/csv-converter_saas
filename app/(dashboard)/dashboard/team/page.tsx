// app/(dashboard)/dashboard/team/page.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { inviteMemberAction, removeMemberAction } from '../../dashboard/team/actions';
import { UserPlus, Trash2 } from 'lucide-react';
import { getTeamMembers } from '@/lib/db/queries'; // You'll need this query helper
import { getUser } from '@/lib/db/queries';
import { redirect } from 'next/navigation';

export default async function TeamPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');

  // Fetching real data from your DB
  const teamMembers = await getTeamMembers(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-[1000] tracking-tighter text-gray-900 uppercase">Team Members</h1>
        <p className="text-gray-500 font-bold text-sm">Manage who has access to this workspace.</p>
      </div>

      {/* --- INVITE FORM --- */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-xl">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <UserPlus className="size-5 text-[#e87d61]" /> Invite New Member
        </h2>
        <form action={inviteMemberAction} className="flex gap-4">
          <Input 
            name="email" 
            type="email"
            placeholder="colleague@company.com" 
            className="rounded-xl border-white/60 bg-white/50"
            required 
          />
          <Button variant="liquid" type="submit">Send Invite</Button>
        </form>
      </div>

      {/* --- MEMBERS LIST --- */}
      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[#e87d61]">
                {member.user.name?.[0] || 'U'}
              </div>
              <div>
                <p className="font-black text-gray-900">{member.user.name || 'Pending User'}</p>
                <p className="text-xs text-gray-500 font-bold">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                {member.role}
              </span>
              {/* Only show delete if it's not the owner and current user is Admin */}
              {member.role !== 'Owner' && (
                <form action={removeMemberAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button variant="ghost" size="icon" type="submit" className="text-gray-400 hover:text-red-500">
                    <Trash2 className="size-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}