'use client';

// POINT THIS TO THE NEW CLEAN ACTION
import { handlePaystackCheckout } from './actions';
import { SubmitButton } from './submit-button';

export function PricingForm({ priceId }: { priceId: string }) {
  return (
    <form action={handlePaystackCheckout}>
      <input type="hidden" name="priceId" value={priceId || ''} />
      <div className="flex justify-center">
        {priceId ? (
          <SubmitButton />
        ) : (
          <button 
            disabled 
            type="button"
            className="bg-gray-200 text-gray-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase cursor-not-allowed border border-gray-300"
          >
            Config Missing
          </button>
        )}
      </div>
    </form>
  );
}