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
  ShieldCheck,
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
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function formatAction(action: ActivityType): string {
  const actions: Record<ActivityType, string> = {
    [ActivityType.SIGN_UP]: 'New account created',
    [ActivityType.SIGN_IN]: 'User signed in',
    [ActivityType.SIGN_OUT]: 'User signed out',
    [ActivityType.UPDATE_PASSWORD]: 'Security credentials updated',
    [ActivityType.DELETE_ACCOUNT]: 'Account permanently deleted',
    [ActivityType.UPDATE_ACCOUNT]: 'Profile information modified',
    [ActivityType.CREATE_TEAM]: 'New team instance initialized',
    [ActivityType.REMOVE_TEAM_MEMBER]: 'Team member de-provisioned',
    [ActivityType.INVITE_TEAM_MEMBER]: 'Collaboration invite issued',
    [ActivityType.ACCEPT_INVITATION]: 'Team invitation confirmed',
  };
  return actions[action] || 'Internal system event';
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <section className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600/70">System Surveillance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tightest">
            Audit Trail
          </h1>
          <p className="text-gray-500 font-medium max-w-md leading-relaxed">
            Real-time cryptographic logs of account interactions and team infrastructure changes.
          </p>
        </div>
      </div>

      {/* --- MAIN LOG CARD --- */}
      <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-gray-50/80 bg-white px-6 md:px-10 py-8">
          <CardTitle className="text-[11px] font-black flex items-center gap-3 uppercase tracking-[0.2em] text-gray-400">
            <div className="bg-gray-900 p-2 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-white" />
            </div>
            Activity Stream
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {logs.length > 0 ? (
            <div className="relative">
              {/* Responsive Timeline Thread - hidden on very small screens */}
              <div className="absolute left-[34px] md:left-[49px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gray-100 to-transparent" />

              <ul className="relative">
                {logs.map((log) => {
                  const Icon = iconMap[log.action as ActivityType] || Settings;
                  const formattedAction = formatAction(log.action as ActivityType);

                  return (
                    <li key={log.id} className="group relative flex items-start gap-4 md:gap-8 p-6 md:px-10 hover:bg-gray-50/40 transition-all duration-300">
                      {/* Icon Container */}
                      <div className="relative z-10 flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-110 group-hover:border-orange-200 transition-all">
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-gray-900 group-hover:text-orange-600 transition-colors" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 pt-1 md:pt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                          <p className="text-sm md:text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {formattedAction}
                          </p>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                            {getRelativeTime(new Date(log.timestamp))}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                              {log.ipAddress || 'Internal'}
                            </p>
                          </div>
                          {log.ipAddress && <ArrowUpRight className="w-3 h-3 text-gray-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-28 px-6">
              <div className="h-24 w-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 group hover:rotate-0 transition-transform duration-500">
                <AlertCircle className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                Quiet Environment
              </h3>
              <p className="text-sm text-gray-500 max-w-[320px] font-medium leading-relaxed">
                The audit trail is currently empty. Actions related to security or teams will be manifested here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- FOOTER SECURITY BAR --- */}
      <div className="group p-1 bg-gray-100 rounded-[2.2rem] transition-all hover:bg-gray-200/50">
        <div className="p-6 md:p-8 rounded-[2rem] bg-white border border-gray-100 text-gray-900 relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-5">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-black text-lg tracking-tight">Integrity Shield Active</p>
                <p className="text-gray-500 text-xs font-medium leading-relaxed mt-1 max-w-sm">
                  System logs are immutable and encrypted. We monitor network origins to prevent unauthorized infrastructure drift.
                </p>
              </div>
            </div>
            <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 transition-all duration-500 active:scale-95">
              Security Protocol
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}