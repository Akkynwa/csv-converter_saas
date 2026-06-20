'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  Menu, 
  FileText, 
  Zap,
  LogOut,
  X,
  MessageCircle // WhatsApp Icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Real-time Activity State (Simulated for now, can be connected to Supabase)
  const [recentActions, setRecentActions] = useState([
    { id: 1, label: 'SQL Export', time: '2m ago' },
    { id: 2, label: 'Schema Mapped', time: '15m ago' },
  ]);

  const navItems = [
    { href: '/dashboard', icon: FileText, label: 'CSV Converter' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/activity', icon: Activity, label: 'History' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' },
    { href: '/dashboard/general', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fdf2f0]">
      
      {/* --- WHATSAPP SUPPORT FLOAT --- */}
      <a 
        href="https://wa.me/your-number" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-[60] group flex items-center gap-3 bg-[#25D366] text-white p-3 pr-6 rounded-full shadow-2xl hover:scale-105 transition-all"
      >
        <div className="bg-white/20 p-2 rounded-full">
          <MessageCircle className="size-5 fill-white" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest hidden md:block">Support</span>
      </a>

      {/* --- MOBILE TRIGGER --- */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[60]">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="size-14 rounded-full shadow-2xl bg-[#e87d61] hover:bg-[#d66b51] text-white p-0"
        >
          {isSidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0",
          "bg-white/70 backdrop-blur-2xl border-r border-white/60",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full py-8">
          {/* Logo Area */}
          <div className="flex items-center gap-3 px-8 mb-10">
            <div className="bg-[#e87d61] p-2 rounded-xl shadow-lg shadow-orange-200">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-[1000] text-xl text-gray-900 tracking-tighter uppercase">CSV Pro</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300",
                    isActive 
                      ? "text-[#e87d61] bg-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-5 bg-[#e87d61] rounded-full"
                    />
                  )}
                  <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-[#e87d61]" : "text-gray-400")} />
                  {item.label}
                </Link>
              );
            })}

            {/* --- RECENT ACTIVITY SECTION (RESTORED) --- */}
            <div className="mt-8">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Recent Activity</p>
              <div className="space-y-2 px-2">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 px-3 py-2 bg-white/30 rounded-xl border border-white/40">
                    <div className="size-1.5 rounded-full bg-orange-400" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-700">{action.label}</p>
                      <p className="text-[8px] text-gray-400 uppercase">{action.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Upgrade Card */}
          <div className="px-4 mb-6">
            <div className="bg-gray-900 rounded-[2rem] p-6 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <p className="text-white font-black text-xs mb-1 uppercase tracking-widest">Pro Plan</p>
                <p className="text-gray-400 text-[10px] mb-4">Architect Access Active.</p>
                <Button asChild size="sm" className="w-full bg-[#e87d61] hover:bg-white hover:text-[#e87d61] rounded-xl font-bold">
                <Link href="/pricing">Upgrade</Link>
                </Button>
              </div>
              <div className="absolute -bottom-4 -right-4 size-20 bg-[#e87d61]/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* --- USER SECTION (UPDATED WITH YOUR IDENTITY) --- */}
          <div className="px-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#e87d61] flex items-center justify-center text-white font-black text-[10px]">
                  NA
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-gray-900">Nwali Akachukwu</span>
                  <span className="text-[9px] text-orange-600 uppercase font-black tracking-tighter">Fullstack Architect</span>
                </div>
              </div>
              <LogOut className="h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-white/30 relative">
        <div className="max-w-6xl mx-auto min-h-full">
           {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}