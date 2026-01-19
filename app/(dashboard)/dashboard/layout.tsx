'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  Menu, 
  FileText, 
  Zap,
  ChevronRight,
  LogOut,
  X
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

  const navItems = [
    { href: '/dashboard', icon: FileText, label: 'Converter' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' },
    { href: '/dashboard/general', icon: Settings, label: 'General' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fdf2f0]">
      {/* 1. MOBILE TRIGGER 
          This floating button only appears on mobile to open the sidebar, 
          preventing the "double navbar" look.
      */}
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
          <div className="flex items-center gap-3 px-8 mb-12">
            <div className="bg-[#e87d61] p-2 rounded-xl shadow-lg shadow-orange-200">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-[1000] text-xl text-gray-900 tracking-tighter uppercase">CSV Pro</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)} // Close on mobile click
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
          </nav>

          {/* Upgrade Card (Polished) */}
          <div className="px-4 mb-6">
            <div className="bg-gray-900 rounded-[2rem] p-6 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <p className="text-white font-black text-xs mb-1 uppercase tracking-widest">Pro Plan</p>
                <p className="text-gray-400 text-[10px] mb-4">Get unlimited exports and AI detection.</p>
                <Button asChild size="sm" className="w-full bg-[#e87d61] hover:bg-white hover:text-[#e87d61] rounded-xl font-bold">
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              </div>
              <div className="absolute -bottom-4 -right-4 size-20 bg-[#e87d61]/20 rounded-full blur-2xl" />
            </div>
          </div>

          {/* User Section */}
          <div className="px-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#e87d61]/10 flex items-center justify-center text-[#e87d61] font-black text-[10px] border border-[#e87d61]/20">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-gray-900">John Doe</span>
                  <span className="text-[9px] text-gray-400 uppercase font-bold">Pro Account</span>
                </div>
              </div>
              <LogOut className="h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-white/30 relative">
        <div className="max-w-5xl mx-auto min-h-full">
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