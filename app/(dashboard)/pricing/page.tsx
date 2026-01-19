import { checkoutAction } from '@/lib/payments/actions';
import { Check, Sparkles } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const basePlan = products.find((product) => product.name === 'Base');
  const plusPlan = products.find((product) => product.name === 'Plus');

  const basePrice = prices.find((price) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price) => price.productId === plusPlan?.id);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#fdf2f0] py-20">
      {/* --- 1. CONSISTENT LIQUID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[100%] rounded-full bg-[#e87d61] opacity-30 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-[#f4a28c] opacity-40 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-gray-900 text-[11px] font-black uppercase tracking-widest mb-6 border border-white shadow-sm">
            <Sparkles className="size-3.5 text-orange-500 fill-orange-400" /> Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-7xl font-[1000] tracking-tighter text-[#2d2d2d] leading-none mb-4">
            Ready to scale <br />
            <span className="text-[#e87d61]">your data?</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard
            name={basePlan?.name || 'Base'}
            price={basePrice?.unitAmount || 800}
            interval={basePrice?.interval || 'month'}
            trialDays={basePrice?.trialPeriodDays || 7}
            features={[
              'Unlimited Usage',
              'Unlimited Workspace Members',
              'Email Support',
            ]}
            priceId={basePrice?.id}
          />
          <PricingCard
            name={plusPlan?.name || 'Plus'}
            price={plusPrice?.unitAmount || 1200}
            interval={plusPrice?.interval || 'month'}
            trialDays={plusPrice?.trialPeriodDays || 7}
            highlight={true} // Adds a special glow to the Plus plan
            features={[
              'Everything in Base, and:',
              'Early Access to New Features',
              '24/7 Support + Slack Access',
            ]}
            priceId={plusPrice?.id}
          />
        </div>
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  highlight = false,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`
      relative p-10 rounded-[3.5rem] transition-all duration-300
      ${highlight 
        ? 'bg-white/60 border-2 border-[#e87d61]/30 shadow-2xl shadow-orange-900/10 scale-105 z-20' 
        : 'bg-white/40 border border-white/60 shadow-xl z-10'
      }
      backdrop-blur-2xl
    `}>
      {/* Subtle White Reflection on top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <h2 className="text-3xl font-[1000] text-gray-900 mb-2 tracking-tighter uppercase">{name}</h2>
      <p className="text-sm font-bold text-[#e87d61] mb-6 tracking-wide">
        WITH {trialDays} DAY FREE TRIAL
      </p>
      
      <div className="flex items-baseline mb-8">
        <span className="text-5xl font-[1000] text-gray-900 tracking-tighter">${price / 100}</span>
        <span className="ml-2 text-sm font-bold text-gray-500 uppercase tracking-tighter opacity-70">
          / {interval}
        </span>
      </div>

      <ul className="space-y-5 mb-10">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-3 mt-1 p-0.5 rounded-full bg-white shadow-sm border border-orange-100">
                <Check className="h-3.5 w-3.5 text-[#e87d61]" strokeWidth={4} />
            </div>
            <span className="text-gray-700 font-bold text-sm leading-tight">{feature}</span>
          </li>
        ))}
      </ul>

      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        {/* We keep the SubmitButton as is, but you could wrap it in a div to center it */}
        <div className="flex justify-center">
            <SubmitButton />
        </div>
      </form>
    </div>
  );
}