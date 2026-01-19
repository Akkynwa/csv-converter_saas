'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Zap, Eraser, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export function RawDataInput() {
  const [data, setData] = useState('');

  const handleClear = () => setData('');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="relative group">
        {/* --- THE GLASS CONTAINER --- */}
        <div className="relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:bg-white/50">
          
          {/* Top Edge Reflection */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#e87d61] p-2.5 rounded-xl shadow-lg shadow-orange-900/10">
                <Database className="size-5 text-white" />
              </div>
              <h2 className="text-2xl font-[1000] text-gray-900 tracking-tighter uppercase">Raw Data Paste</h2>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleClear}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Clear content"
              >
                <Eraser className="size-5" />
              </button>
            </div>
          </div>

          {/* --- THE TEXTAREA (FROSTED DEPTH) --- */}
          <div className="relative">
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste your CSV, JSON, or Tab-Separated values here..."
              className="w-full h-64 p-6 bg-white/30 border border-white/40 rounded-[1.5rem] text-gray-800 font-mono text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#e87d61]/20 focus:border-[#e87d61]/30 outline-none transition-all resize-none shadow-inner"
            />
            
            {/* Empty State Overlay */}
            {!data && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Clipboard className="size-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Supported: CSV • JSON • TXT
            </p>
            
            <Button 
              disabled={!data.trim()}
              className="w-full sm:w-auto h-12 px-10 bg-[#151515] text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-30"
            >
              <Zap className="size-4 mr-3 fill-[#e87d61] text-[#e87d61]" />
              Convert Data
            </Button>
          </div>
        </div>

        {/* Decorative background glow for the active card */}
        <div className="absolute -z-10 inset-0 bg-[#e87d61] opacity-0 group-hover:opacity-5 blur-[80px] transition-opacity duration-700" />
      </div>
    </motion.div>
  );
}