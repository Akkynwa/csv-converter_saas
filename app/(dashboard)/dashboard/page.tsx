import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { conversionHistory } from '@/lib/db/schema';
import { getTeamForUser, getUser } from '@/lib/db/queries';

import CSVConverter from './csv-converter';
import { DashboardAnimations } from '@/components/animations';

// 1. History List Component (Server-side data fetching)
async function HistoryList({ teamId }: { teamId: number }) {
  const history = await db
    .select()
    .from(conversionHistory)
    .where(eq(conversionHistory.teamId, teamId))
    .orderBy(desc(conversionHistory.createdAt))
    .limit(5);

  if (history.length === 0) {
    return (
      <div className="mt-12 p-10 border-2 border-dashed rounded-3xl text-center bg-white/50 backdrop-blur-sm">
        <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">No conversion history yet</p>
        <p className="text-xs text-gray-400 mt-1">Your recent exports will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Clock className="w-4 h-4 text-orange-600" />
        </div>
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity</h2>
      </div>
      
      <div className="grid gap-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group p-4 flex justify-between items-center bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                  <span className="text-lg">📄</span>
               </div>
               <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{item.fileName}</span>
                <span className="text-xs text-gray-500 font-medium">{item.rowCount.toLocaleString()} rows</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="hidden sm:block text-[10px] bg-gray-900 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                {item.format}
              </span>
              <span className="text-xs font-medium text-gray-400">
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Main Dashboard Page (Server Component)
export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const team = await getTeamForUser(user.id);
  
  if (!team) {
    return <div>Loading team data...</div>;
  }

  const isPro = team.subscriptionStatus === 'active' || team.subscriptionStatus === 'trialing';

  return (
    <section className="relative flex-1 p-4 lg:p-8 max-w-5xl mx-auto z-10">
      {/* Background Ambience Layer */}
      <div className="fixed inset-0 -z-10 bg-mesh opacity-60" />

      {/* Hero Header Area */}
      <div className="flex flex-col mb-10">
        <div className="flex items-center gap-2 mb-2">
           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white uppercase tracking-widest">Workspace</span>
           {isPro && (
             <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-widest border border-amber-200">
               <Sparkles className="w-2 h-2" /> Pro Plan
             </span>
           )}
        </div>
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
          CSV Converter
        </h1>
        <p className="text-base text-gray-500 mt-2 max-w-xl">
          Upload messy CSVs and instantly export clean data. Your files are processed locally for maximum privacy.
        </p>
      </div>
      
      {/* Framer Motion Wrapper for smooth entry */}
      <DashboardAnimations>
        {/* Note: FileDropOverlay is now inside CSVConverter to avoid serialization errors */}
        <CSVConverter isPro={isPro} />
        
        <Suspense fallback={<div className="mt-12 animate-pulse h-40 bg-gray-200/50 rounded-3xl" />}>
          <HistoryList teamId={team.id} />
        </Suspense>
      </DashboardAnimations>
    </section>
  );
}