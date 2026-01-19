import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  LogOut,
  UserPlus,
  Lock,
  UserCog,
  AlertCircle,
  UserMinus,
  Mail,
  CheckCircle,
  Clock,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { ActivityType } from '@/lib/db/schema';
import { getActivityLogs } from '@/lib/db/queries';
import { cn } from '@/lib/utils';

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
  [ActivityType.CREATE_TEAM]: UserPlus,
  [ActivityType.REMOVE_TEAM_MEMBER]: UserMinus,
  [ActivityType.INVITE_TEAM_MEMBER]: Mail,
  [ActivityType.ACCEPT_INVITATION]: CheckCircle,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 8400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  const actions: Record<ActivityType, string> = {
    [ActivityType.SIGN_UP]: 'Account created',
    [ActivityType.SIGN_IN]: 'Signed in',
    [ActivityType.SIGN_OUT]: 'Signed out',
    [ActivityType.UPDATE_PASSWORD]: 'Password updated',
    [ActivityType.DELETE_ACCOUNT]: 'Account deleted',
    [ActivityType.UPDATE_ACCOUNT]: 'Profile updated',
    [ActivityType.CREATE_TEAM]: 'Team created',
    [ActivityType.REMOVE_TEAM_MEMBER]: 'Member removed',
    [ActivityType.INVITE_TEAM_MEMBER]: 'Invitation sent',
    [ActivityType.ACCEPT_INVITATION]: 'Invitation accepted',
  };
  return actions[action] || 'System action';
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          Audit Trail
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Monitor account security and team changes in real-time.
        </p>
      </div>

      <Card className="border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30 px-8 py-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
            <Clock className="w-4 h-4 text-orange-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length > 0 ? (
            <div className="relative">
              {/* Timeline Thread */}
              <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-100 via-gray-100 to-transparent" />

              <ul className="divide-y divide-gray-50">
                {logs.map((log) => {
                  const Icon = iconMap[log.action as ActivityType] || Settings;
                  const formattedAction = formatAction(log.action as ActivityType);

                  return (
                    <li key={log.id} className="relative flex items-center gap-4 p-6 px-8 hover:bg-gray-50/50 transition-colors group">
                      {/* Icon with Ring */}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-gray-50 shadow-sm group-hover:border-orange-100 transition-colors">
                        <Icon className="w-5 h-5 text-orange-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {formattedAction}
                          </p>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            {getRelativeTime(new Date(log.timestamp))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-gray-500 font-medium truncate">
                            {log.ipAddress ? `IP: ${log.ipAddress}` : 'System Process'}
                          </p>
                          {log.ipAddress && <ArrowUpRight className="w-3 h-3 text-gray-300" />}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
              <div className="h-20 w-20 bg-orange-50 rounded-[2rem] flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">
                Empty Trail
              </h3>
              <p className="text-sm text-gray-500 max-w-[280px] font-medium leading-relaxed">
                We haven't recorded any major actions yet. Start using your dashboard to see logs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Info Card */}
      <div className="p-6 rounded-[2rem] bg-orange-600 text-white relative overflow-hidden shadow-lg shadow-orange-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Security Monitoring Active</p>
              <p className="text-orange-100 text-xs font-medium">We track IP addresses to help you identify unauthorized access.</p>
            </div>
          </div>
          <button className="bg-white text-orange-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-colors">
            Learn More
          </button>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>
    </section>
  );
}