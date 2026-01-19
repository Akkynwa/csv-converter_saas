'use client';

import * as React from "react";
import { Slot as SlotPrimitive } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles: removed heavy focus rings for a cleaner glass look
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-30 active:scale-95 outline-none tracking-tight",
  {
    variants: {
      variant: {
        // --- THE NEW GLASS PRIMARY ---
        glass: 
          "bg-white/40 backdrop-blur-md border border-white/60 text-gray-900 shadow-[0_8px_32px_0_rgba(255,255,255,0.01)] hover:bg-white/60 hover:border-white/80 hover:shadow-lg",
        
        // --- THE SIGNATURE LIQUID (CORAL) ---
        liquid: 
          "bg-[#e87d61] text-white shadow-[0_10px_20px_-5px_rgba(232,125,97,0.3)] hover:bg-[#d66b51] hover:shadow-[0_15px_25px_-5px_rgba(232,125,97,0.4)] border border-white/20",

        // --- DARK GLASS (FOR FOOTERS/CONTRAST) ---
        darkGlass: 
          "bg-[#151515]/80 backdrop-blur-xl border border-white/10 text-white hover:bg-black hover:border-white/20 shadow-2xl",
        
        outline:
          "border border-white/40 bg-transparent hover:bg-white/20 text-gray-700 backdrop-blur-sm",
        
        ghost:
          "hover:bg-white/40 text-gray-600 hover:text-gray-900",
        
        link: "text-[#e87d61] underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-4 text-xs uppercase tracking-widest font-black",
        lg: "h-14 px-10 text-base rounded-[1.2rem]",
        icon: "size-11 rounded-full"
      }
    },
    defaultVariants: {
      variant: "glass",
      size: "default"
    }
  }
);

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? SlotPrimitive : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };