'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasteConverterProps {
  onProcess: (data: string) => void;
  isProcessing: boolean;
}

export function PasteConverter({ onProcess, isProcessing }: PasteConverterProps) {
  const [csvText, setCsvText] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Validation Logic
  useEffect(() => {
    if (!csvText.trim()) {
      setIsValid(null);
      return;
    }

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setIsValid(false);
      setErrorMsg('Need at least a header and one row of data.');
      return;
    }

    const headerCount = lines[0].split(',').length;
    const isConsistent = lines.every((line) => {
      if (!line.trim()) return true; 
      return line.split(',').length === headerCount;
    });

    if (!isConsistent) {
      setIsValid(false);
      setErrorMsg('Column count mismatch found in some rows.');
    } else {
      setIsValid(true);
      setErrorMsg('');
    }
  }, [csvText]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <Zap className="size-4 text-orange-500 fill-orange-500" /> 
          Instant Paste Engine
        </h3>
        
        {isValid !== null && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest transition-all ${
            isValid ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {isValid ? 'Format Valid' : 'Format Error'}
          </div>
        )}
      </div>

      <textarea
        className={`w-full h-72 p-8 rounded-[2rem] bg-gray-50/50 border-2 transition-all focus:ring-0 text-sm font-mono placeholder:text-gray-300 resize-none leading-relaxed ${
          isValid === false ? 'border-red-100 focus:border-red-200' : 'border-transparent focus:border-orange-100'
        }`}
        placeholder="id,name,email&#10;1,Akachukwu,aka@example.com&#10;2,Gemini,ai@google.com"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        disabled={isProcessing}
      />

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-h-[20px]">
          {errorMsg && (
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="size-3" /> {errorMsg}
            </p>
          )}
        </div>

        <Button
          onClick={() => onProcess(csvText)}
          disabled={!isValid || isProcessing}
          className="bg-gray-900 text-white px-10 h-14 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 shadow-xl shadow-gray-900/10"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Convert Data'
          )}
        </Button>
      </div>
    </div>
  );
}