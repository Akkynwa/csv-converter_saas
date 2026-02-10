import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Clock, Sparkles, LayoutGrid, Type } from 'lucide-react';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { conversionHistory } from '@/lib/db/schema';
import { getTeamForUser, getUser } from '@/lib/db/queries';

import CSVConverter from './csv-converter'; // This now contains both Upload & Paste
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
      <div className="mt-12 p-10 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center bg-white/30 backdrop-blur-sm">
        <div className="bg-white shadow-sm w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-bold text-gray-600 uppercase tracking-tight">No history yet</p>
        <p className="text-xs text-gray-400 mt-1">Your 10k+ row exports will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Activity</h2>
        </div>
        <button className="text-[10px] font-black text-orange-600 uppercase hover:underline">View All</button>
      </div>
      
      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group p-5 flex justify-between items-center bg-white border border-gray-100 rounded-[2rem] hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors border border-gray-100">
                  <span className="text-xl">📄</span>
               </div>
               <div className="flex flex-col">
                <span className="font-bold text-gray-900 tracking-tight">{item.fileName}</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  {item.rowCount.toLocaleString()} Rows • {item.format}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400">
                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <LayoutGrid className="w-4 h-4 text-gray-400" />
              </button>
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  const isPro = team.subscriptionStatus === 'active' || team.subscriptionStatus === 'trialing';

  return (
    <section className="relative flex-1 p-4 lg:p-12 max-w-6xl mx-auto z-10 w-full">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Hero Header Area */}
      <div className="flex flex-col mb-12">
        <div className="flex items-center gap-2 mb-4">
           <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-600 text-white uppercase tracking-widest shadow-lg shadow-orange-600/20">
             Console
           </span>
           {isPro && (
             <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-white text-amber-600 uppercase tracking-widest border border-amber-100 shadow-sm">
               <Sparkles className="w-3 h-3 fill-amber-500" /> Pro Member
             </span>
           )}
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">
          DATA <span className="text-orange-600">STATIONS</span>
        </h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
          The fastest way to process messy CSV files. Upload high-volume data (10k+ rows) or paste raw text for instant conversion.
        </p>
      </div>
      
      <DashboardAnimations>
        {/* The CSVConverter should be updated to show both Upload and Paste side-by-side */}
        <CSVConverter isPro={isPro} />
        
        <Suspense fallback={
          <div className="mt-16 space-y-4">
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-24 bg-gray-100 animate-pulse rounded-[2rem]" />
            <div className="h-24 bg-gray-100 animate-pulse rounded-[2rem]" />
          </div>
        }>
          <HistoryList teamId={team.id} />
        </Suspense>
      </DashboardAnimations>
    </section>
  );
}