'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Database, AlertCircle, Zap, FileText, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { logConversionAction } from './actions';
import { FileDropOverlay } from '@/components/file-drop-overlay'; // Import the overlay

export default function CSVConverter({ isPro }: { isPro: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const rowLimit = isPro ? 1000000 : 10;

  // Unified logic for processing files (Both button click and drag-drop)
  const processFile = (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!isPro && results.data.length > rowLimit) {
          setError(`Free limit reached. Only the first 10 rows are available.`);
          setData(results.data.slice(0, 10));
        } else {
          setData(results.data);
        }
        setIsProcessing(false);
        // Small haptic feedback via confetti for the upload itself
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      },
      error: (err) => {
        setError("Could not parse CSV. Please check the file format.");
        setIsProcessing(false);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f43f5e', '#fbbf24']
    });
  };

  const downloadJSON = async () => {
    if (data.length === 0) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    await logConversionAction(fileName, data.length, 'json');
    a.href = url;
    a.download = `${fileName || 'data'}.json`;
    a.click();
    triggerCelebration();
  };

  const downloadSQL = async () => {
    if (data.length === 0) return;
    const tableName = fileName.toLowerCase().replace(/\s+/g, '_') || 'my_table';
    const headers = Object.keys(data[0]);
    
    let sql = `CREATE TABLE ${tableName} (\n`;
    sql += headers.map(h => `  ${h.toLowerCase().replace(/\s+/g, '_')} TEXT`).join(',\n');
    sql += `\n);\n\nINSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
    
    const rows = data.map(row => 
      `(${Object.values(row).map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')})`
    ).join(',\n');
    
    sql += rows + ';';

    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    await logConversionAction(fileName, data.length, 'sql');
    a.href = url;
    a.download = `${tableName}.sql`;
    a.click();
    triggerCelebration();
  };

  return (
    <div className="space-y-6">
      {/* 1. The Global Overlay - Now safely inside a Client Component */}
      <FileDropOverlay onFileDrop={processFile} />

      {/* Upload Zone */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <Card className="relative p-10 border-2 border-dashed border-gray-200 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center rounded-[2rem] overflow-hidden">
          {isProcessing ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
               <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
               <p className="font-bold text-gray-900">Crunching your data...</p>
            </div>
          ) : (
            <>
              <div className="bg-orange-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              
              <label className="cursor-pointer text-center">
                <span className="text-lg font-bold text-gray-900 block mb-1">Click to upload or drag & drop</span>
                <span className="text-sm text-gray-500 block mb-6">CSV files only (Max {isPro ? '1GB' : '10 rows'})</span>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                <Button variant="secondary" className="rounded-full px-8 pointer-events-none shadow-sm">
                  Select File
                </Button>
              </label>
            </>
          )}

          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            {isPro ? (
              <span className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Zap className="w-3 h-3 mr-1 fill-orange-600" /> Pro Access Active
              </span>
            ) : (
              <span className="text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                Free Tier
              </span>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center p-4 bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-2xl text-amber-800 text-sm shadow-sm"
          >
            <AlertCircle className="w-4 h-4 mr-3 flex-shrink-0 text-amber-600" />
            <div className="flex-1 font-medium">{error}</div>
            <Button asChild variant="ghost" size="sm" className="ml-4 hover:bg-amber-100 text-amber-900 rounded-full font-bold">
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Preview & Actions */}
      {data.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="overflow-hidden border-gray-100 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md">
            <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">{data.length} Rows Parsed</h3>
                <p className="text-xs text-gray-500 font-medium">Filename: {fileName}.csv</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={downloadJSON} className="rounded-full bg-gray-900 hover:bg-gray-800 px-6 transition-transform hover:scale-105 active:scale-95">
                  <FileJson className="w-4 h-4 mr-2 text-rose-400" /> Export JSON
                </Button>
                <Button onClick={downloadSQL} className="rounded-full bg-gray-900 hover:bg-gray-800 px-6 transition-transform hover:scale-105 active:scale-95">
                  <Database className="w-4 h-4 mr-2 text-orange-400" /> Export SQL
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[400px]">
               {/* Table content remains the same */}
               <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    {Object.keys(data[0]).map(k => (
                      <th key={k} className="p-4 border-b font-bold text-gray-400 uppercase tracking-tighter">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.slice(0, 10).map((row, i) => (
                    <motion.tr 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-orange-50/30 transition-colors"
                    >
                      {Object.values(row).map((v: any, j) => (
                        <td key={j} className="p-4 text-gray-700 font-medium">{v}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}