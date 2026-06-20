'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion'; 
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { 
  Database, Search, Upload, Layers, Trash2, 
  Copy, Check, ChevronRight, Braces, FileJson, FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileDropOverlay } from '@/components/file-drop-overlay';
import { PasteConverter } from '@/components/csv/paste-converter';

// --- CUSTOM MINI TOOLTIP COMPONENT ---
const SimpleTooltip = ({ children, label }: { children: React.ReactNode, label: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex flex-col items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-md whitespace-nowrap z-50 pointer-events-none shadow-xl"
          >
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CSVConverter({ isPro }: { isPro: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});

  const triggerSuccess = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ea580c', '#3b82f6'] });
  };

  const detectType = (val: any): string => {
    if (!val) return "TEXT";
    const str = String(val).trim();
    return (!isNaN(Number(str)) && !isNaN(parseFloat(str))) ? "NUMERIC" : "TEXT";
  };

  const handleDataInput = (input: File | string, isPaste = false) => {
    setIsProcessing(true);
    const name = isPaste ? `Snippet_${Date.now().toString().slice(-4)}` : (input as File).name.replace(/\.[^/.]+$/, "");
    setFileName(name);

    Papa.parse(input as any, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = !isPro ? results.data.slice(0, 10) : results.data;
        setData(rows);
        if (rows.length > 0) {
          const initialMap: Record<string, string> = {};
          Object.keys(rows[0]).forEach(k => initialMap[k] = k.toLowerCase().replace(/\s+/g, '_'));
          setColumnMapping(initialMap);
        }
        setIsProcessing(false);
        toast.success("Ready for export");
      }
    });
  };

  const saveFile = (content: string, name: string, type: string) => {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    triggerSuccess();
  };

  const downloadSQL = () => {
    if (data.length === 0) return;
    const tableName = fileName.toLowerCase().replace(/\s+/g, '_');
    const headers = Object.keys(data[0]);
    let sql = `INSERT INTO ${tableName} VALUES\n` + data.map(row => 
      `(${headers.map(h => {
        const v = row[h];
        return v === null ? "NULL" : detectType(v) === "NUMERIC" ? v : `'${String(v).replace(/'/g, "''")}'`;
      }).join(', ')})`
    ).join(',\n') + ';';
    saveFile(sql, `${tableName}.sql`, 'text/plain');
  };

  const downloadJSON = () => {
    if (data.length === 0) return;
    const mappedData = data.map(row => {
      const newRow: Record<string, any> = {};
      Object.entries(row).forEach(([key, value]) => {
        const newKey = columnMapping[key] || key;
        newRow[newKey] = detectType(value) === "NUMERIC" ? Number(value) : value;
      });
      return newRow;
    });
    saveFile(JSON.stringify(mappedData, null, 2), `${fileName}.json`, 'application/json');
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">
      <FileDropOverlay onFileDrop={(files) => handleDataInput(files[0])} />

      {/* --- TOP CONTROL BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="inline-flex bg-gray-100 p-1 rounded-xl shadow-inner">
          {['upload', 'paste'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-xl border-gray-200 h-10 px-4 text-[10px] font-bold uppercase tracking-tighter hover:bg-white">
            <label className="cursor-pointer flex items-center gap-2">
              <Upload className="size-3.5" /> New File
              <input type="file" hidden accept=".csv" onChange={(e) => e.target.files?.[0] && handleDataInput(e.target.files[0])} />
            </label>
          </Button>
          {data.length > 0 && (
            <Button onClick={() => setData([])} variant="ghost" className="h-10 w-10 p-0 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {data.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activeTab === 'upload' ? (
              <div className="border-2 border-dashed border-gray-100 rounded-[2rem] p-20 flex flex-col items-center text-center bg-gray-50/30">
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4"><Layers className="size-6 text-gray-300" /></div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Drop CSV to begin</p>
              </div>
            ) : (
              <PasteConverter onProcess={(val) => handleDataInput(val, true)} isProcessing={isProcessing} />
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <Card className="lg:col-span-3 overflow-hidden border-gray-100 rounded-[1.5rem] shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-orange-50 p-2 rounded-lg"><FileText className="size-4 text-orange-500" /></div>
                  <h3 className="text-sm font-bold text-gray-700 truncate tracking-tight">{fileName}</h3>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <SimpleTooltip label="Export JSON">
                    <button onClick={downloadJSON} className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                      <FileJson className="size-4 text-gray-400 group-hover:text-blue-500" />
                    </button>
                  </SimpleTooltip>

                  <SimpleTooltip label="Export SQL">
                    <button onClick={downloadSQL} className="p-2 hover:bg-orange-50 rounded-lg transition-colors group">
                      <Database className="size-4 text-gray-400 group-hover:text-orange-500" />
                    </button>
                  </SimpleTooltip>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                  <input 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search records..." 
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-2 px-2 shrink-0">
                  {filteredData.length} Rows
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-4 border-b w-12 text-center text-gray-300 font-bold italic">#</th>
                      {Object.keys(data[0]).map(k => (
                        <th key={k} className="p-4 border-b">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{k}</span>
                            <div className="flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded-md shadow-sm">
                              <ChevronRight className="size-2.5 text-orange-400" />
                              <input 
                                value={columnMapping[k] || ""} 
                                onChange={(e) => setColumnMapping({...columnMapping, [k]: e.target.value})}
                                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-bold text-gray-600 w-full"
                              />
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.slice(0, 15).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-center">
                          <button onClick={() => { 
                              navigator.clipboard.writeText(JSON.stringify(row));
                              setCopiedId(i); 
                              setTimeout(() => setCopiedId(null), 1000); 
                            }} className="text-gray-200 hover:text-orange-500">
                            {copiedId === i ? <Check className="size-3" /> : <Copy className="size-3" />}
                          </button>
                        </td>
                        {Object.values(row).map((v: any, j) => (
                          <td key={j} className="p-4 text-gray-500 truncate max-w-[150px] font-medium">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="space-y-4">
               <Card className="p-6 border-none bg-gray-900 text-white rounded-[1.5rem] shadow-xl">
                 <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 mb-6">Quick Export</h4>
                 <div className="grid grid-cols-1 gap-3">
                    <Button onClick={downloadJSON} className="w-full bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                      <FileJson className="size-3.5 mr-2" /> Download JSON
                    </Button>
                    <Button onClick={downloadSQL} className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/40 transition-all active:scale-95">
                      <Database className="size-3.5 mr-2" /> Generate SQL
                    </Button>
                 </div>
               </Card>
               
               <div className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Architect Tip</p>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    "Custom column names override the JSON keys for a cleaner data structure."
                  </p>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}