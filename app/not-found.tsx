'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundClient() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white/60 backdrop-blur-xl border border-white shadow-2xl rounded-[3rem] p-12 text-center"
    >
      {/* Floating Icon */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex justify-center mb-8"
      >
        <div className="bg-orange-100 p-6 rounded-[2rem] shadow-inner">
          <Compass className="size-16 text-orange-600 stroke-[1.5px]" />
        </div>
      </motion.div>

      {/* Text Content */}
      <div className="space-y-4 mb-10">
        <h1 className="text-7xl font-black text-gray-900 tracking-tighter">
          404
        </h1>
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
          Page Not Found
        </h2>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          The link you followed may be broken, or the page may have been moved to a new destination.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="group flex items-center justify-center gap-2 py-4 px-8 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200 active:scale-95"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
        
        <button 
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 py-4 px-8 bg-transparent text-gray-400 hover:text-gray-900 rounded-2xl font-bold text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="size-4" />
          Previous Page
        </button>
      </div>
    </motion.div>
  );
}