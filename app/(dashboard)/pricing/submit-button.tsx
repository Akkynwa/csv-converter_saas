'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`
        relative overflow-hidden w-full h-14 rounded-full
        bg-[#151515] text-white font-black text-xs uppercase tracking-[0.2em]
        transition-all duration-300 group
        hover:bg-[#e87d61] hover:shadow-[0_10px_30px_rgba(232,125,97,0.4)]
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      {/* Mirror Reflection Highlight on the button edge */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/50" />
      
      <div className="relative z-10 flex items-center justify-center">
        {pending ? (
          <>
            <Loader2 className="animate-spin mr-3 h-4 w-4" />
            Processing...
          </>
        ) : (
          <>
            Get Started
            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rotate-[-45deg]" />
          </>
        )}
      </div>

      {/* Subtle Inner Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
}