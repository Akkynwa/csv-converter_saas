'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redeemCode } from '@/lib/actions/redeem';
import { toast } from 'sonner';
import { Ticket } from 'lucide-react';

export function RedeemCodeForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await redeemCode(code);
    
    if (result.success) {
      toast.success('Lifetime Access Activated!', {
        description: 'Welcome to the CSV Pro family.'
      });
      setCode('');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-orange-100 rounded-[2rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-50 rounded-2xl">
          <Ticket className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Redeem License</h3>
          <p className="text-xs text-gray-400">Enter your AppSumo or partner code below.</p>
        </div>
      </div>

      <form onSubmit={handleRedeem} className="flex gap-2">
        <Input 
          placeholder="PRO-XXXX-XXXX" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="rounded-xl border-gray-100 uppercase font-mono"
        />
        <Button disabled={loading || !code} className="bg-orange-600 hover:bg-orange-700 rounded-xl px-8 font-bold">
          {loading ? 'Validating...' : 'Activate'}
        </Button>
      </form>
    </div>
  );
}