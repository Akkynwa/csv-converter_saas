'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Repeat, Lock, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReverseConvertProps {
  batchId: string;
  filename: string;
  isPro: boolean;
}

export function ReverseConvertButton({ batchId, filename, isPro }: ReverseConvertProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReverse = async () => {
    // 1. Guard for non-pro users
    if (!isPro) {
      toast.error('Pro Feature', {
        description: 'Upgrade to Pro to reverse-convert and download past files.',
        action: {
          label: 'Upgrade',
          onClick: () => router.push('/pricing'),
        },
      });
      return;
    }

    // 2. Guard for missing batch data
    if (!batchId) {
      toast.error('Data Missing', {
        description: 'No batch ID found for this conversion.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 3. Call your API route to fetch the JSON/SQL from the processedData table
      const response = await fetch(`/api/convert/reverse?batchId=${batchId}`);
      
      if (!response.ok) throw new Error('Failed to retrieve data');

      const data = await response.json();

      // 4. Create a download link for the user
      const blob = new Blob([JSON.stringify(data.rowData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reversed_${filename.replace('.csv', '')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('File retrieved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Download failed', {
        description: 'Could not retrieve the original processed data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isLoading}
      onClick={handleReverse}
      className="group flex items-center gap-2 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPro ? (
        <Download className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
      ) : (
        <Lock className="w-3.5 h-3.5 text-gray-300" />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {isPro ? 'Retrieve' : 'Pro'}
      </span>
    </Button>
  );
}