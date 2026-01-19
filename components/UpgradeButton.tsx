'use client';

import { useState } from 'react';
import { Zap, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UpgradeButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const { url } = await res.json();
      // Redirect the user to Stripe's hosted checkout page
      window.location.href = url;
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleCheckout}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-6 py-3 font-black text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs uppercase tracking-[0.1em]">Securing session...</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 fill-white" />
              <span className="text-sm uppercase tracking-[0.1em]">Upgrade to Pro</span>
            </div>
            
            <div className="flex items-center gap-1 border-l border-white/20 pl-2 ml-1">
              <span className="text-xs font-medium text-orange-100">$19/mo</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </>
        )}
      </div>
    </motion.button>
  );
}