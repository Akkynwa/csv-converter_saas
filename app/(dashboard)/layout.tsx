'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Using SWR is great because it won't break static generation
  const { data: user, error } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  // If there's no user or an error fetching, show the public nav
  if (!user || error) {
    return (
      <div className="flex items-center gap-3 md:gap-6">
        <Link
          href="/pricing"
          className="hidden sm:block text-[11px] md:text-[13px] font-black uppercase tracking-widest text-gray-700 hover:text-[#e87d61] transition-colors"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full bg-[#151515] hover:bg-black px-4 md:px-6 h-9 md:h-10 font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-lg">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger className="outline-none focus:ring-0">
        <div className="flex items-center gap-2 p-1 md:pr-3 rounded-full bg-white/50 border border-white/60 hover:bg-white/80 transition-all shadow-sm">
          <Avatar className="size-7 md:size-8 border border-white">
  {/* We use a placeholder or null since the 'image' property doesn't exist in your schema */}
  <AvatarImage src="" alt={user.name || ''} /> 
  <AvatarFallback className="bg-[#e87d61] text-white font-bold text-[10px]">
    {(user.name || user.email).substring(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
          <ChevronDown className={`hidden md:block size-4 text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        className="w-[calc(100vw-2rem)] sm:w-56 p-2 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[1.5rem] shadow-2xl overflow-hidden"
      >
        <DropdownMenuItem asChild className="rounded-xl focus:bg-[#e87d61]/10 focus:text-[#e87d61] cursor-pointer font-bold text-gray-700 py-4 sm:py-3">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-3 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <div className="h-[1px] bg-gray-200/50 my-1 mx-2" />
        
        {/* Changed from action={handleSignOut} to onClick to prevent hydration mismatches in some Canary builds */}
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-xl focus:bg-red-50 focus:text-red-600 cursor-pointer font-bold text-gray-700 py-4 sm:py-3"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 md:pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-full md:rounded-[2rem] px-4 md:px-8 py-2.5 md:py-3 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
          
          <Link href="/" className="flex items-center group shrink-0">
            <div className="bg-[#e87d61] p-1.5 rounded-lg shadow-lg shadow-orange-900/20 transition-transform active:scale-90">
               <div className="size-3.5 md:size-4 bg-white rounded-sm" />
            </div>
            <span className="ml-2.5 text-lg md:text-xl font-[1000] text-gray-900 tracking-tighter">CSV Pro</span>
          </Link>

          <div className="flex items-center">
            {/* Suspense is the key here. It tells the build worker: 
                "If you can't render the UserMenu yet, just leave the skeleton and move on." */}
            <Suspense fallback={<div className="size-8 md:size-9 bg-white/20 animate-pulse rounded-full" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen pt-20 md:pt-28">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>
    </section>
  );
}