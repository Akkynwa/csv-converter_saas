'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Sparkles, 
  UploadCloud, 
  Database, 
  Code, 
  Zap, 
  Search 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#fdf2f0]">
      
      {/* --- 1. LIQUID FLUID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[90%] h-[100%] rounded-full bg-[#e87d61] opacity-30 blur-[140px]" />
        <div className="absolute top-[15%] left-[-10%] w-[70%] h-[80%] rounded-full bg-[#f4a28c] opacity-40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] rounded-full bg-[#e87d61] opacity-25 blur-[130px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* --- 2. FLOATING GLASS NAVIGATION --- */}
        <header className="fixed top-0 left-0 right-0 z-[100] px-4 pt-4 md:pt-6">
          <div className="max-w-7xl mx-auto">
            <nav className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-full px-6 py-3 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              
              <Link href="/" className="flex items-center group shrink-0">
                <div className="bg-[#e87d61] p-1.5 rounded-lg shadow-lg shadow-orange-900/20 group-hover:rotate-6 transition-transform">
                   <div className="size-3.5 md:size-4 bg-white rounded-sm" />
                </div>
                <span className="ml-2.5 text-xl font-[1000] text-gray-900 tracking-tighter">CSV Pro</span>
              </Link>

              <div className="flex items-center gap-3 md:gap-6">
                <Link href="/pricing" className="text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-[#e87d61] transition-colors hidden sm:block">
                  Pricing
                </Link>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-black/5 hover:bg-black/10 rounded-full cursor-pointer transition-colors">
                    <Search className="size-4 text-gray-900" />
                  </div>
                  {/* <Button asChild className="rounded-full bg-[#1e293b] hover:bg-black/10 px-6 h-9 font-black text-[10px] uppercase tracking-[0.15em] shadow-xl"> */}
                    <Button asChild className="rounded-full bg-slate-700/50 hover:bg-slate-600 border border-white/10 hover:border-white/20 px-6 h-9 font-black text-[10px] uppercase tracking-[0.15em] shadow-xl transition-all">
                    <Link href="/sign-up">Join Now</Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </header>

        {/* --- 3. HERO CONTENT --- */}
        <section className="pt-32 md:pt-48 pb-20 px-6 text-center lg:text-left lg:px-20 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-gray-900 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-10 border border-white shadow-xl mx-auto lg:mx-0"
          >
            <Sparkles className="size-3.5 text-orange-500 fill-orange-400" /> AI-Powered Schema Detection
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-[80px] font-[1000] tracking-tighter text-[#1a1a1a] leading-[0.9] mb-8"
          >
            Effortless Data <br />
            <span className="text-[#e87d61]">Transformation.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600/80 font-bold mb-12 max-w-xl mx-auto lg:mx-0 leading-tight"
          >
            Converts CSVs into clean JSON, SQL, or other formats. High-performance pipelines for your workflow.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
          >
            <Button asChild className="h-16 px-10 bg-slate-900 border border-white/10 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-blue-500/10 hover:scale-[1.02] active:scale-95 group">
  <Link href="/dashboard" className="flex items-center">
    Start Converting Free 
    <ArrowRight className="ml-3 size-4 rotate-[-45deg] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </Link>
</Button>
           <Button asChild variant="ghost" className="h-16 px-12 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-sm hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-95">
  <Link href="#features">learn more</Link>
</Button>
          </motion.div>
        </section>

        {/* --- 4. FEATURE CARDS --- */}
        <section className="py-16 px-6 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<UploadCloud className="size-10" />}
            title="Instant Conversion"
            desc="Transform legacy CSV files into ready-to-use JSON objects in milliseconds."
            variant="orange"
            delay={0.4}
          />
          <FeatureCard 
            icon={<Database className="size-10" />}
            title="Smart Schema"
            desc="Automatic inference of data types and optimal SQL schemas for your database."
            variant="blue"
            delay={0.5}
          />
          <FeatureCard 
            icon={<Code className="size-10" />}
            title="Dev API First"
            desc="Clean documentation and robust REST APIs designed specifically for engineers."
            variant="green"
            delay={0.6}
          />
        </section>

        {/* --- 5. BLACK MIRROR FOOTER BOX --- */}
        <section className="px-6 pb-24 max-w-7xl w-full mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-[#0c0c0c] rounded-[3.5rem] py-20 px-8 text-center overflow-hidden shadow-2xl border border-white/5"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />
            
            <h2 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter mb-10 relative z-10 leading-tight">
              Unlock Advanced Features
            </h2>
            
            <Button asChild className="relative z-10 h-16 px-12 bg-gradient-to-r from-[#ff9a7b] to-[#e87d61] text-white rounded-full font-black text-[11px] uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-xl shadow-orange-950/40">
              <Link href="/pricing"><Zap className="size-5 mr-3 fill-white" /> Upgrade to Pro</Link>
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, variant, delay }: { icon: any, title: string, desc: string, variant: 'orange' | 'blue' | 'green', delay: number }) {
  const styles = {
    orange: { bg: "bg-[#e87d61]" },
    blue: { bg: "bg-[#3b82f6]" },
    green: { bg: "bg-[#22c55e]" }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white/40 backdrop-blur-2xl border border-white/40 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center text-center group transition-all duration-500 hover:bg-white/60"
    >
      <div className={`${styles[variant].bg} text-white p-7 rounded-full mb-8 shadow-lg relative`}>
        {/* White Rim Reflection */}
        <div className="absolute inset-[-4px] rounded-full border-2 border-white/80 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-transform duration-500 group-hover:scale-110" />
        {icon}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">{title}</h3>
      <p className="text-gray-600/60 font-bold text-sm leading-relaxed px-2">{desc}</p>
    </motion.div>
  );
}