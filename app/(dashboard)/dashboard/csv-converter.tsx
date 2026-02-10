'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileJson, 
  Database, 
  AlertCircle, 
  Zap, 
  FileText, 
  Loader2, 
  Type, 
  FileUp, 
  Copy, 
  Search,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { logConversionAction } from './actions';
import { FileDropOverlay } from '@/components/file-drop-overlay';
import { PasteConverter } from '@/components/csv/paste-converter';

export default function CSVConverter({ isPro }: { isPro: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const rowLimit = isPro ? 1000000 : 10;

  // 1. Unified Logic for processing data
  const processData = (input: File | string) => {
    setIsProcessing(true);
    setError(null);
    setSearchTerm(""); // Reset search on new upload

    if (typeof input !== 'string') {
      setFileName(input.name.replace(/\.[^/.]+$/, ""));
    } else {
      setFileName("pasted_data");
    }

    Papa.parse(input as any, {
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
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      },
      error: () => {
        setError("Could not parse CSV. Please check the format.");
        setIsProcessing(false);
      }
    });
  };

  // 2. Filter logic (Global Search)
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 3. Helper Functions
  const copyRowToClipboard = (row: any, index: number) => {
    const rowString = Object.values(row).join(', ');
    navigator.clipboard.writeText(rowString);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-8">
      <FileDropOverlay onFileDrop={processData} />

      {/* TABS SWITCHER */}
      <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl w-fit mx-auto border border-gray-200">
        <button 
          onClick={() => { setActiveTab('upload'); setData([]); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'upload' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileUp className="w-4 h-4" /> Upload
        </button>
        <button 
          onClick={() => { setActiveTab('paste'); setData([]); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'paste' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Type className="w-4 h-4" /> Paste
        </button>
      </div>

      {/* INPUT SECTION */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="relative p-12 border-2 border-dashed border-gray-200 bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center rounded-[2.5rem] overflow-hidden min-h-[300px]">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                   <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
                   <p className="font-black text-gray-900 uppercase tracking-tighter">Parsing Stream...</p>
                </div>
              ) : (
                <label className="cursor-pointer text-center group">
                  <div className="bg-orange-50 p-5 rounded-3xl mb-4 mx-auto w-fit group-hover:scale-110 transition-transform duration-500 border border-orange-100">
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                  <span className="text-xl font-black text-gray-900 block mb-1 tracking-tight">Select your CSV file</span>
                  <span className="text-[10px] font-black text-gray-400 block mb-8 uppercase tracking-widest">Max {isPro ? '1GB' : '10 rows'}</span>
                  <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && processData(e.target.files[0])} className="hidden" />
                  <Button variant="outline" className="rounded-2xl px-10 border-2 font-bold pointer-events-none">Choose File</Button>
                </label>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div key="paste" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <PasteConverter onProcess={processData} isProcessing={isProcessing} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR MESSAGE */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-900 text-sm">
            <AlertCircle className="w-5 h-5 mr-3 text-rose-600" />
            <div className="flex-1 font-bold">{error}</div>
            {!isPro && <Button asChild variant="link" size="sm" className="text-rose-600 font-black uppercase text-[10px]"><Link href="/pricing">Upgrade</Link></Button>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TABLE PREVIEW & SEARCH */}
      {data.length > 0 && !isProcessing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white ring-1 ring-gray-100">
            {/* Header with Stats & Exports */}
            <div className="p-8 border-b border-gray-50 flex flex-wrap gap-6 justify-between items-center bg-gray-50/20">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{data.length.toLocaleString()} Rows</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Source: {fileName}</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={downloadJSON} className="rounded-2xl bg-gray-100 hover:bg-orange-600 px-8 h-12 font-bold shadow-lg shadow-gray-900/10 transition-all">
                  <FileJson className="w-4 h-4 mr-2" /> JSON
                </Button>
                <Button onClick={downloadSQL} className="rounded-2xl bg-gray-100 hover:bg-orange-600 px-8 h-12 font-bold shadow-lg shadow-gray-900/10 transition-all">
                  <Database className="w-4 h-4 mr-2" /> SQL
                </Button>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="px-8 py-4 border-b border-gray-50 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search across all columns..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="px-4 py-2 bg-orange-50 rounded-lg text-[10px] font-black text-orange-600 uppercase tracking-widest">
                {filteredData.length} Found
              </div>
            </div>
            
            {/* DATA TABLE */}
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    <th className="p-5 border-b w-12"></th>
                    {Object.keys(data[0]).map(k => (
                      <th key={k} className="p-5 border-b font-black text-gray-400 uppercase tracking-widest text-[9px]">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-orange-50/20 transition-colors group">
                      <td className="p-5 border-b">
                        <button 
                          onClick={() => copyRowToClipboard(row, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-orange-600"
                        >
                          {copiedId === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </td>
                      {Object.values(row).map((v: any, j) => (
                        <td key={j} className="p-5 text-gray-600 font-medium border-b border-gray-50/50">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4"><Search className="text-gray-300" /></div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching rows found</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}