'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  FileUp, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- MOCK DATA (Replace with your actual data fetching) ---
const activities = [
  { id: 1, type: 'upload', label: 'File Converted', desc: 'data_export_v2.csv', time: '2 mins ago', icon: FileUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 2, type: 'team', label: 'New Member', desc: 'Sarah Chen joined the team', time: '4 hours ago', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, type: 'security', label: 'Password Changed', desc: 'Security credentials updated', time: 'Yesterday', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 4, type: 'general', label: 'Profile Updated', desc: 'Changed display name', time: '2 days ago', icon: Settings, color: 'text-purple-600', bg: 'bg-purple-100' },
];

export default function ActivityPage() {
  return (
    <section className="flex-1 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          Activity Log
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          A real-time history of actions performed within your team.
        </p>
      </div>

      <Card className="border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b border-gray-50 bg-gray-50/30 px-8 py-6">
          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
            <Activity className="w-4 h-4 text-orange-600" />
            Live Event Stream
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* The Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent" />

            <div className="divide-y divide-gray-50">
              {activities.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 p-6 px-8 hover:bg-gray-50/50 transition-all group"
                >
                  {/* Icon Indicator */}
                  <div className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm border-2 border-white transition-transform group-hover:scale-110",
                    item.bg, item.color
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-gray-900 leading-none">
                        {item.label}
                      </p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500">
                      {item.desc}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 self-center opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', val: '1,284' },
          { label: 'Files Exported', val: '852' },
          { label: 'Team Actions', val: '142' },
          { label: 'Security Alerts', val: '0' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/50 backdrop-blur-sm border border-gray-100 p-4 rounded-3xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-gray-900">{stat.val}</p>
          </div>
        ))}
      </div>
    </section>
  );
}